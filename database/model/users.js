db.createCollection( "Users",
   {
      validator: { $or:
         [
            { user: { $regex: /@info\.uaic\.ro$/ } },
            { password: { $type: "string" } },
            { role: { $type: "string" } },
            { subordinateRoles: { $type: "array" } },
            { actions: { $type: "array" } },
            { apiKey: { $type: "string" } },
            { keyExpires: { $type: "date" } },
            { identityConfirmed: { $type: "bool" } }
         ]
      }
   }
)
