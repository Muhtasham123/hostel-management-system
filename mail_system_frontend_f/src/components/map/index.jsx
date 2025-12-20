import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import React from 'react'

const Map = () => {
    const icon = new L.Icon({
        iconUrl: require("./location.png"),
        iconSize:[38, 38]
    })
  return (
      <MapContainer center={[31.5204, 74.3587]} zoom={15} style={{ height: 300, zIndex:1}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <Marker position={[31.5204, 74.3587]} icon={icon}>
            <Popup>
                <h1>Lahore</h1>
            </Popup>
          </Marker>
      </MapContainer>
  )
}

export default Map
