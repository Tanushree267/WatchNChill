// src/pages/SeatLayout.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import { assets } from '../assets/assets'
import { toast } from 'react-hot-toast'
import { useSelection } from '../contexts/SelectionContext.jsx'
import { useAppContext } from '../context/AppContext'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]
  const { id } = useParams() // movie id (from route)
  const navigate = useNavigate()
  const { selection, setSelection, clearSelection } = useSelection()
  const { user } = useAppContext()

  const [showTimes, setShowTimes] = useState([]) // all shows for this movie
  const [selectedTime, setSelectedTime] = useState(null) // selected show object
  const [localSeats, setLocalSeats] = useState(selection?.seats || [])
  const [saving, setSaving] = useState(false)
  const [loadingShows, setLoadingShows] = useState(true)

  // mapping showId => occupiedSeats (object or array)
  const [occupiedMap, setOccupiedMap] = useState({})

  // fetch shows (extracted so we can poll)
  const fetchShows = useCallback(async () => {
    setLoadingShows(true)
    try {
      const res = await fetch(`http://localhost:3000/shows?movieId=${encodeURIComponent(id)}`)
      const data = await res.json()
      // support both { success:true, shows } and direct array shapes
      const arr = data?.shows && Array.isArray(data.shows) ? data.shows : Array.isArray(data) ? data : (Array.isArray(data?.shows) ? data.shows : [])
      setShowTimes(arr)

      // build occupied map
      const map = {}
      for (const s of arr) {
        // show.occupiedSeats could be object map {A1: true} or array ['A1','B2']
        map[String(s._id)] = s.occupiedSeats || {}
      }
      setOccupiedMap(map)
    } catch (err) {
      console.error('Failed to load shows', err)
      toast.error('Failed to load show timings')
      setShowTimes([])
      setOccupiedMap({})
    } finally {
      setLoadingShows(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    fetchShows()

    // poll every 8 seconds for updates so seat occupancy stays fresh
    const interval = setInterval(() => {
      fetchShows()
    }, 8000)

    return () => clearInterval(interval)
  }, [id, fetchShows])

  // group shows by YYYY-MM-DD
  const groupedByDate = useMemo(() => {
    return showTimes.reduce((acc, s) => {
      const key = new Date(s.showDateTime).toISOString().split('T')[0]
      acc[key] = acc[key] || []
      acc[key].push(s)
      return acc
    }, {})
  }, [showTimes])

  // selected date key from selection (if present)
  const selectedDateKey = useMemo(() => {
    if (!selection?.showDateTime) return null
    const s = String(selection.showDateTime)
    return s.includes('T') ? s.split('T')[0] : s
  }, [selection?.showDateTime])

  // shows for that date (sorted)
  const showsForDate = useMemo(() => {
    const dateKey = selectedDateKey || Object.keys(groupedByDate)[0] || null
    if (!dateKey) return []
    const arr = (groupedByDate[dateKey] || []).slice()
    arr.sort((a, b) => new Date(a.showDateTime) - new Date(b.showDateTime))
    return arr
  }, [groupedByDate, selectedDateKey])

  // defer selecting default show to avoid setState during render
  useEffect(() => {
    if (!showsForDate.length) return

    const t = setTimeout(() => {
      if (!selectedTime) {
        if (selection?.showId) {
          const pref = showsForDate.find(s => String(s._id) === String(selection.showId))
          if (pref) { setSelectedTime(pref); return }
        }
        setSelectedTime(showsForDate[0])
      } else {
        // if selectedTime exists, try to sync it with latest showTimes data (update occupiedSeats)
        const updated = showsForDate.find(s => String(s._id) === String(selectedTime._id))
        if (updated) setSelectedTime(updated)
      }
    }, 0)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showsForDate])

  // when a time is picked
  const pickTime = (show) => {
    setSelectedTime(show)
    const dateKey = new Date(show.showDateTime).toISOString().split('T')[0]
    setSelection(prev => ({
      ...prev,
      movieId: prev.movieId ?? id,
      showDateTime: dateKey,
      showId: show._id,
      seats: []
    }))
    setLocalSeats([])
  }

  const hasValidShow = () => Boolean(selectedTime)

  // helper: check if seat is occupied for current selected show
  const isSeatOccupied = (seatId, showObj = selectedTime) => {
    if (!showObj) return false
    const occ = occupiedMap[String(showObj._id)] || showObj.occupiedSeats || {}
    // occ may be object map {A1:true} or array ['A1']
    if (!occ) return false
    if (Array.isArray(occ)) return occ.includes(seatId)
    // object map
    return Boolean(occ[seatId])
  }

  // toggle seat selection (max 5) with occupied check
  const handleSeatClick = (seatId) => {
    if (!hasValidShow()) {
      toast.error("Please select a show time first")
      return
    }

    // if seat is already occupied (someone booked it earlier), prevent selecting
    if (isSeatOccupied(seatId)) {
      toast.error("Seat already booked")
      return
    }

    setLocalSeats(prev => {
      const exists = prev.includes(seatId)
      let next
      if (exists) next = prev.filter(s => s !== seatId)
      else {
        if (prev.length >= 5) {
          toast.error("You can select maximum 5 seats")
          return prev
        }
        next = [...prev, seatId]
      }
      setSelection(sel => ({ ...sel, seats: next }))
      return next
    })
  }

  // pricing fallback and category
  const CATEGORY_PRICES = { VIP: 300, PREMIUM: 250, STANDARD: 180 }
  const seatCategory = (row) => {
    if (["A", "B"].includes(row)) return "VIP"
    if (["C", "D", "E"].includes(row)) return "PREMIUM"
    return "STANDARD"
  }

  const totalAmount = useMemo(() => {
    if (!localSeats || localSeats.length === 0) return 0
    if (selectedTime?.showPrice) return localSeats.length * Number(selectedTime.showPrice)
    return localSeats.reduce((sum, s) => {
      const r = s[0]
      return sum + (CATEGORY_PRICES[seatCategory(r)] ?? 180)
    }, 0)
  }, [localSeats, selectedTime])

  const proceedToCheckout = async () => {
    if (!localSeats || localSeats.length === 0) {
      toast.error("Please select at least one seat")
      return
    }
    if (!selectedTime) {
      toast.error("Please select a show time")
      return
    }

    // check again client-side that none of selected seats got occupied between selection and checkout
    const conflicts = localSeats.filter(s => isSeatOccupied(s))
    if (conflicts.length) {
      toast.error(`Seat(s) already booked: ${conflicts.join(', ')}`)
      // refresh shows to show latest occupancy
      await fetchShows()
      return
    }

    // check login
    if (!user?.email) {
      toast.error("Please login to proceed")
      sessionStorage.setItem("redirectAfterLogin", "/my-bookings")
      navigate("/login")
      return
    }

    const bookingPayload = {
      user: user.email,
      showId: selectedTime._id,
      amount: totalAmount,
      bookedSeats: localSeats,
      isPaid: false,
    }

    try {
      setSaving(true)
      const res = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      })

      if (res.ok) {
        toast.success("Booking confirmed!")
        // update local occupied map for immediate UI feedback (so seats become blocked)
        setOccupiedMap(prev => {
          const copy = { ...prev }
          const sid = String(selectedTime._id)
          const current = copy[sid] || selectedTime.occupiedSeats || {}
          // normalize to object map
          let newMap = {}
          if (Array.isArray(current)) {
            current.forEach(s => { newMap[s] = true })
          } else {
            newMap = { ...current }
          }
          localSeats.forEach(s => { newMap[s] = true })
          copy[sid] = newMap
          return copy
        })

        clearSelection()
        navigate("/my-bookings")
        return
      } else {
        const err = await res.json().catch(() => ({ message: 'Server error' }))
        toast.error(err.message || "Booking failed")
      }
    } catch (err) {
      console.error('Booking error', err)
      toast.error("Server error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: count }).map((_, i) => {
          const seatId = `${row}${i + 1}`
          const isActive = localSeats.includes(seatId)
          const occupied = isSeatOccupied(seatId)
          return (
            <button
              key={seatId}
              onClick={() => { if (!occupied) handleSeatClick(seatId) }}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
                ${isActive ? "bg-primary text-white" : ""}
                ${occupied ? "bg-gray-600 text-gray-200 opacity-70 cursor-not-allowed" : ""}`}
              title={`${seatId} • ${seatCategory(row)} • ₹${selectedTime?.showPrice ?? (CATEGORY_PRICES[seatCategory(row)] ?? 180)}`}
              disabled={occupied}
            >
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  if (loadingShows) return <div className="text-center py-40">Loading show timings...</div>
  if (!showsForDate || showsForDate.length === 0) return <div className="text-center py-40 text-gray-400">No show times for the selected date.</div>

  // show only first 3 times (as requested)
  const timesToShow = showsForDate.slice(0, 3)

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* LEFT: Only times (no date headings) */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {timesToShow.map(show => (
            <div
              key={show._id}
              onClick={() => pickTime(show)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?._id === show._id ? "bg-primary text-white" : "hover:bg-primary/20"}`}
            >
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{isoTimeFormat(show.showDateTime)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Seat layout and booking summary */}
      <div className='relative flex flex-1 flex-col items-center max-md:mt-16'>
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map(row => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        <div className='w-full max-w-md mt-8'>
          <div className='bg-[#1f1416] p-4 rounded-md'>
            <p className='text-sm text-gray-400'>Selected Time</p>
            <p className='font-medium'>{selectedTime ? isoTimeFormat(selectedTime.showDateTime) : "—"}</p>

            <p className='text-sm text-gray-400 mt-3'>Seats</p>
            <p className='font-medium'>{localSeats.length ? localSeats.join(", ") : "None selected"}</p>

            <p className='text-sm text-gray-400 mt-3'>Total</p>
            <p className='text-2xl font-bold'>₹{totalAmount}</p>

            <button
              onClick={proceedToCheckout}
              disabled={saving}
              className='flex items-center gap-1 mt-6 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 disabled:opacity-60'
            >
              {saving ? "Processing..." : "Proceed to checkout"}
              <ArrowRightIcon stroke={3} className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout;