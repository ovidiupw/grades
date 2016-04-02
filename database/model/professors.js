db.createCollection( "Professors",
   {
      validator: { $and:
         [
            { user: { $regex: /@info\.uaic\.ro$/ } },
            { gradDidactic: { $type: "string" } },
            { course: { $type: "string" } }
         ]
      }
   }
)