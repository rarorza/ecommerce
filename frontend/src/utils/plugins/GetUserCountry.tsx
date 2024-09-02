import { useEffect, useState } from 'react'

function GetUserCountry() {
  const [address, setAddress] = useState('')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      fetch(url)
        .then((res) => res.json())
        .then((data) => setAddress(data.address))
    })
  }, [])
  return address
}

export default GetUserCountry
