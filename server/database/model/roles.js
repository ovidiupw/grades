db.createCollection( "Roles",
   {
      validator: { $and:
         [
            { title: { $type: "string" } },
            { actions: { $type: "array" } }
         ]
      }
   }
)
