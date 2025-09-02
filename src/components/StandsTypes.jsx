const StandTypes = ({ stands, onStandChange, onStandsCountChange }) => {
  return (
    <div>
      <label htmlFor="standTypesNumber">Stand Types Available:</label>
      <input
        type="number"
        min="0"
        name="standTypesNumber"
        value={stands.length}
        onChange={(e) => onStandsCountChange(parseInt(e.target.value))}
      />
      {stands.map((stand, idx) => (
        <div key={idx} >
          <label> Stand {idx+1} Type</label>
          <input
            type="text"
            name="standType"
            value={stand.type}
            onChange={(e) => onStandChange(idx, "type", e.target.value)}
          />
          <label htmlFor="standFee"> Stand {idx+1} Price</label>
          <input
            type="number"
            name="standFee"
            value={stand.fee}
            min ="0"
            onChange={(e) => onStandChange(idx, "fee", e.target.value)}
          />
          <label htmlFor="availability"> Stand {idx+1} Availability</label>
          <input
            type="number"
            name="availability"
            value={stand.availability}
            onChange={(e) => onStandChange(idx, "availability", e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}

export default StandTypes
