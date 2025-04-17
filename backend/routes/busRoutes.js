const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

const busData = [
  {
    busNumber: 1,
    from: "Paota",
    to: "Pal Road",
    via: ["Paota","Jodhpur Railway Station", "Jalori Gate", "12 Road", "Nahar Chouraha","Pal Road"],
    distance: 20,
  },
  {
    busNumber: 2,
    from: "Banar",
    to: "SoorSagar",
    via: ["Banar", "Kalvi Pyao", "Paota", "Sojati Gate","Jalori Gate","Siwanchi Gate","Akhliya Circle","PratapNagar","SoorSagar"],
    distance: 20,
  },
  {
    busNumber: 4,
    from: "Mangra Punjla",
    to: "AIIMS",
    via: ["Mangra Punjla", "Gokulji Pyao", "Kishore Bagh","Mandore Krishi Mandi","Paota","Sojati Gate","Jodhpur Railway Station","Nehru Park","Medical Circle","Shastri Nagar","AIIMS"],
    distance: 17,
  },
  {
    busNumber: 5,
    from: "Mandalnath Circle",
    to: "Siwanchi Gate",
    via: ["Mandalnath Circle", "Mandore", "Kishore Bagh", "Mahamandir","Paota","Rai Ka Bagh Railway Station","Sojati Gate","Jalori Gate","Siwanchi Gate"],
    distance: 18,
  },
  {
    busNumber: 6,
    from: "Banar",
    to: "Salawas",
    via: ["Banar", "Kalvi Pyao", "Ramjan Hatha","Paota","Rai Ka Bagh Railway Station","Police Line","Rotary Circle","New Power House","Daoji Hotel","AIIMS","Sangariya Phanta","Tanawada Phanta","Salawas"],
    distance: 23,
  },
  {
    busNumber: 7,
    from: "Mandore",
    to: "Chokha",
    via: ["Mandore", "Kishore Bagh", "Mahamandir","Paota","Jodhpur Railway Station", "Jalori Gate","Bombay Motor","Akhliya Circle","Bhatti ki Bawdi","Filter House","Chopasani","Chokha"],
    distance: 30,
  },
  {
    busNumber: 10,
    from: "Paota",
    to: "Jhalamand",
    via: ["Paota","KN College", "Ratanada Sabji Mandi", "PWD Circle","Bhagat ki Kothi Railway Station","Krishi Mandi", "Navdurga Colony","Jhalamand Circle","High Court","Jhalamand"],
    distance: 15,
  },
  {
    busNumber: 15,
    from: "Dali Bai Circle",
    to: "Nav Mil",
    via: ["Dali Bai Circle","Gangana Phanta","11 sector", "12 sector", "21 sector","14 sector","Dev Nagar", "Akhliya Circle","Bombay Motor","Siwanchi Gate","Shanishchar Than","Jalori Gate","Jodhpur Railway Station","Paota","Nagori Gate","Bhadwasiya","Ram Sagar","Nav Mil"],
    distance: 26,
  },
  {
    busNumber: 23,
    from: "Boranada",
    to: "Shikargarh",
    via: ["Boranada","Pal Gaon","21 sector", "Kheme ka Kua", "Pal Road","Shastrinagar Thana","12 Road","Siwanchi Gate","Shanishchar Than","Jalori Gate","Jodhpur Railway Station","Olympic","Khatarnak Puliya","Railway Hospital","JDA","Bhati Circle","Ratanada Circle","Army Area","Shikargarh"],
    distance: 15,
  },
  {
    busNumber: 2,
    from: "Airforce",
    to: "SoorSagar",
    via: ["Airforce","Panch Batti", "Bhati Circle", "Police Line", "Sojati Gate","Jodhpur Raiway Station","Jalori Gate","Shanishchar Than","Bombay Motor","PratapNagar","SoorSagar"],
    distance: 20,
  },
  {
    busNumber: 1,
    from: "Mandore",
    to: "Guru ka Talab",
    via: ["Mandore","Kishore Bagh","Mahamandir", "Paota", "KN College", "Circuit House","Panch Batti","Airforce","Bheruji Circle","Medical Circle","12 Road","Bombay Motor","Akhliya Circle","Pratap Nagar","Guru ka Talab"],
    distance: 20,
  },
  {
    busNumber: 10,
    from: "Ghantaghar",
    to: "Sangariya",
    via: ["Ghantaghar","Sojati Gate","Jodhpur Railway Station", "Jalori Gate", "Nehru Park","Bheruji Circle", "Krishi Mandi", "Madhuban Housing Board","Rameshwar Nagar","KK Colony","Kudi Housing Board","Sangariya"],
    distance: 15,
  },
  {
    busNumber: 6,
    from: "Ghantaghar",
    to: "Salawas",
    via: ["Ghantaghar","Sojati Gate","Jodhpur Railway Station", "Jalori Gate", "Nehru Park","Medical Circle","Mathuradas Hospital","New Power House","Daoji Hotel","AIIMS","Sangariya Phanta","Tanawada Phanta","Salawas"],
    distance: 23,
  },
];

// Populate API (updated to allow same bus number with different routes)
router.post("/populate", async (req, res) => {
    try {
      let added = 0;
  
      for (const bus of busData) {
        // Check for exact same entry (busNumber, from, to, via)
        const exists = await Bus.findOne({
          busNumber: bus.busNumber,
          from: bus.from,
          to: bus.to,
          via: bus.via,
        });
  
        if (!exists) {
          await Bus.create(bus);
          added++;
        }
      }
  
      if (added === 0) {
        return res.status(400).json({ message: "All bus entries already exist." });
      }
  
      res.status(201).json({ message: `${added} buses added successfully!` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Search API by location
router.get("/buses", async (req, res) => {
  try {
    const { location, page = 1, limit = 10 } = req.query;

    const query = location
      ? { via: { $regex: location, $options: "i" } }
      : {};

    const totalCount = await Bus.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const buses = await Bus.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      data: buses,
      currentPage: Number(page),
      totalPages,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

  

module.exports = router;
