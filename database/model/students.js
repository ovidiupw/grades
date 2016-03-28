db.createCollection( "Students",
   {
      validator: { $and:
         [
            { user: { $regex: /@info\.uaic\.ro$/ } },
            { registrationNumber: { $type: "string" } },
            { birthDate: { $type: "date" } },
            { academicYear: { $type: "string" } },
            { academicGroup: { $type: "string" } }
         ]
      }
   }
)