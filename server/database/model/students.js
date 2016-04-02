db.createCollection( "Students",
   {
      validator: { $and:
         [
            { user: {  $type: "string" } },
            { registrationNumber: { $type: "string" } },
            { birthDate: { $type: "date" } },
            { academicYear: { $type: "string" } },
            { academicGroup: { $type: "string" } }
         ]
      }
   }
)
