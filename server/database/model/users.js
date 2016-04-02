db.createCollection( "Users",
   {
      validator: { $or:
         [
            { user: { $regex: /@info\.uaic\.ro$/ } },
            { role: { $type: "string" } },
            { actions: { $type: "array" } },
            { apiKey: { $type: "string" } },
            { keyExpires: { $type: "date" } },
            { identityConfirmed: { $type: "bool" } }
         ]
      }
   }
)
