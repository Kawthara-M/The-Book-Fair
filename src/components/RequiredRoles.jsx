import { useState, useEffect } from "react"

const RequiredRoles = ({ sumStands, halls, handleRolesChange }) => {

  const predefinedRoles = [
    {
      name: "Publisher",
      description: "Handles publishing tasks",
      standsLimit: 1,
    },
    { name: "Author", description: "Creates content", standsLimit: 1 },
    {
      name: "Food Provider",
      description: "Manages food stalls",
      standsLimit: 1,
    },
  ]

  const [selectedPredefined, setSelectedPredefined] = useState([])

  // the ones selected and new roles added
  const [customRoles, setCustomRoles] = useState([])

  const getPredefinedDefaults = (name) => {
    return predefinedRoles.find((role) => role.name === name)
  }

  const togglePredefined = (name) => {
    setSelectedPredefined((prev) => {
      const isSelected = prev.includes(name)
      if (!isSelected) {
        const alreadyExists = customRoles.find((role) => role.name === name)
        if (!alreadyExists) {
          const defaults = getPredefinedDefaults(name)
          setCustomRoles((prev) => [
            ...prev,
            {
              name,
              description: defaults?.description || "",
              standsLimit: defaults?.standsLimit || 1,
            },
          ])
        }
        return [...prev, name]
      } else {
        // reached when checkbox isn't selected
        return prev.filter((roleName) => roleName !== name)
      }
    })
  }

  const handlePredefinedChange = (name, field, value) => {
   
    // we receive name because we might have multipe roles that we can edit, field is thr porperty of this role to be edited
    setCustomRoles((prev, index) => {
      const existing = prev.find((role) => role.name === name)
      const updated = existing
        ? prev.map((role) =>
            role.name === name ? { ...role, [field]: value } : role
          )
        : [
            // if a predefined role wasn't slected "checked", it will now be added to custom roles
            ...prev,
            {
              name,
              description: "",
              standsLimit: 1,
            },
          ]
          console.log("update of predefined",updated)

      return updated
    })
  }

  // function to show new inputs when "add more" button is clicked
  const addCustomRole = () => {
        console.log("custom roles at beg", customRoles)

    setCustomRoles((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        standsLimit: 1,
        isCustom: true,
      },
    ])
  }

  const handleCustomRoleChange = (index, field, value) => {
    console.log("custom roles at beg", customRoles)
    const updated = customRoles.map((role, i) => {
      if (i === index) {
        return {
          ...role,
          [field]: field === "standsLimit" ? parseInt(value) : value,
        }
      }
      return role
    })
    
    setCustomRoles(updated)
    console.log(updated)
  }

  const totalUsedStands = customRoles.reduce(
    (sum, role) =>
      selectedPredefined.includes(role.name) || role.isCustom
        ? sum + (Number(role.standsLimit) || 0)
        : sum,
    0
  )

  const overLimit = totalUsedStands > sumStands

  useEffect(() => {
    const selectedRoles = customRoles.filter(
      (role) => selectedPredefined.includes(role.name) || role.isCustom
    )
    handleRolesChange?.(selectedRoles)
  }, [customRoles, selectedPredefined])

  return (
    <div className="roles">
      {predefinedRoles.map((role) => {
        const selected = selectedPredefined.includes(role.name)
        const roleData =
          customRoles.find((customRole) => customRole.name === role.name) || {}

        return (
          <div className="role" key={role.name}>
            <div className="line">
            <label>
              {role.name}
            </label>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => togglePredefined(role.name)}
              /></div>

            {selected && (
              <div>
                <label htmlFor={`${role.name}Description`}>Description</label>
                <input
                  type="text"
                  name={`${role.name}Description`}
                  placeholder={`${role.name} description` || ""}
                  value={roleData.description || ""}
                  onChange={(e) =>
                    handlePredefinedChange(
                      role.name,
                      "description",
                      e.target.value
                    )
                  }
                />
                <label>Stands Limit</label>
                <input
                  type="number"
                  max={sumStands}
                  min="1"
                  value={roleData.standsLimit || 1}
                  onChange={(e) =>
                    handlePredefinedChange(
                      role.name,
                      "standsLimit",
                      e.target.value
                    )
                  }
                />
            
              </div>
            )}
          </div>
        )
      })}

      <h4>Additional Roles</h4>
    {customRoles
  .map((role, realIndex) => ({ role, realIndex })) 
  .filter(({ role }) => role.isCustom)
  .map(({ role, realIndex }, displayIndex) => (
    <div key={displayIndex}>
      <label>Role Name</label>
      <input
        type="text"
        value={role.name}
        onChange={(e) =>
          handleCustomRoleChange(realIndex, "name", e.target.value)
        }
      />
      <label>Description</label>
      <input
        type="text"
        value={role.description}
        onChange={(e) =>
          handleCustomRoleChange(realIndex, "description", e.target.value)
        }
      />
      <label>Stands Limit</label>
      <input
        type="number"
        min="1"
        max={sumStands}
        value={role.standsLimit}
        onChange={(e) =>
          handleCustomRoleChange(realIndex, "standsLimit", e.target.value)
        }
      />
    </div>
  ))}


      <button type="button" onClick={addCustomRole}>
        Add more roles
      </button>

      <div>
        {overLimit && (
          <p style={{ color: "red" }}>Exceeds total available stands!</p>
        )}
      </div>
    </div>
  )
}

export default RequiredRoles
