const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Initialize Supabase client
const supabaseUrl = 'https://prdigwmezbxiqjqqqxeg.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZGlnd21lemJ4aXFqcXFxeGVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI0MjE1MSwiZXhwIjoyMDc2ODE4MTUxfQ.K71ABBTJ87eJMeWk94_aCDXRdJJ0v6dQHu_EGoGwUJs'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importData() {
  try {
    // Read the scraped data
    const dataPath = path.join(__dirname, '../../all_colony_data_improved.json')
    const rawData = fs.readFileSync(dataPath, 'utf8')
    const data = JSON.parse(rawData)

    console.log(`Found ${data.colonies.length} colonies to import`)

    let successCount = 0
    let errorCount = 0

    for (const colonyData of data.colonies) {
      try {
        // Insert colony
        const { data: colony, error: colonyError } = await supabase
          .from('colonies')
          .insert({
            name: colonyData.colony_name,
            location: colonyData.colony_location,
            latitude: colonyData.location_data?.latitude,
            longitude: colonyData.location_data?.longitude,
            coordinates: colonyData.location_data?.coordinates
          })
          .select()
          .single()

        if (colonyError) {
          console.error(`Error inserting colony ${colonyData.colony_name}:`, colonyError)
          errorCount++
          continue
        }

        // Insert contacts
        const contacts = []
        
        // Switchboard contacts
        if (colonyData.contacts_data?.switchboard) {
          const switchboard = colonyData.contacts_data.switchboard
          if (switchboard.phones && Array.isArray(switchboard.phones)) {
            for (const phone of switchboard.phones) {
              contacts.push({
                colony_id: colony.id,
                contact_type: 'switchboard',
                phone: phone,
                extensions: switchboard.extensions,
                name: switchboard.name
              })
            }
          } else if (switchboard.phones) {
            contacts.push({
              colony_id: colony.id,
              contact_type: 'switchboard',
              phone: switchboard.phones,
              extensions: switchboard.extensions,
              name: switchboard.name
            })
          }
        }

        // Manager contacts
        if (colonyData.contacts_data?.manager) {
          const manager = colonyData.contacts_data.manager
          const managerContact = {
            colony_id: colony.id,
            contact_type: 'manager',
            name: manager.name
          }
          
          if (manager.phones && Array.isArray(manager.phones)) {
            managerContact.phone = manager.phones[0]
          } else if (manager.phones) {
            managerContact.phone = manager.phones
          }
          
          if (manager.faxes && Array.isArray(manager.faxes)) {
            managerContact.fax = manager.faxes[0]
          } else if (manager.faxes) {
            managerContact.fax = manager.faxes
          }
          
          contacts.push(managerContact)
        }

        // Minister contacts
        if (colonyData.contacts_data?.minister) {
          const minister = colonyData.contacts_data.minister
          const ministerContact = {
            colony_id: colony.id,
            contact_type: 'minister',
            name: minister.name
          }
          
          if (minister.phones && Array.isArray(minister.phones)) {
            ministerContact.phone = minister.phones[0]
          } else if (minister.phones) {
            ministerContact.phone = minister.phones
          }
          
          contacts.push(ministerContact)
        }

        // Postal address
        if (colonyData.contacts_data?.postal_address) {
          const postal = colonyData.contacts_data.postal_address
          contacts.push({
            colony_id: colony.id,
            contact_type: 'postal',
            street: postal.street,
            city: postal.city,
            zip_code: postal.zip_code
          })
        }

        // School contacts
        if (colonyData.contacts_data?.school) {
          const school = colonyData.contacts_data.school
          const schoolContact = {
            colony_id: colony.id,
            contact_type: 'school'
          }
          
          if (school.phones && Array.isArray(school.phones)) {
            schoolContact.phone = school.phones[0]
          } else if (school.phones) {
            schoolContact.phone = school.phones
          }
          
          if (school.faxes && Array.isArray(school.faxes)) {
            schoolContact.fax = school.faxes[0]
          } else if (school.faxes) {
            schoolContact.fax = school.faxes
          }
          
          contacts.push(schoolContact)
        }

        // Insert all contacts for this colony
        if (contacts.length > 0) {
          const { error: contactsError } = await supabase
            .from('contacts')
            .insert(contacts)

          if (contactsError) {
            console.error(`Error inserting contacts for ${colonyData.colony_name}:`, contactsError)
          }
        }

        successCount++
        console.log(`✓ Imported ${colonyData.colony_name}, ${colony.location} (${contacts.length} contacts)`)

      } catch (error) {
        console.error(`Error processing colony ${colonyData.colony_name}:`, error)
        errorCount++
      }
    }

    console.log(`\nImport completed:`)
    console.log(`✓ Successfully imported: ${successCount} colonies`)
    console.log(`✗ Errors: ${errorCount} colonies`)

  } catch (error) {
    console.error('Error during import:', error)
  }
}

// Run the import
importData()
