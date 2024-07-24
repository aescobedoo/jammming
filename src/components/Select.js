import React from "react";

export default function Dropdown({handleSelect, devices}) {
  return (
      <select id="dropdown" onChange={handleSelect}>
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
  );
}