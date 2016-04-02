db.createCollection( "Permissions",
   {
      validator: { $and:
         [
            { title: { $type: "string" } },
            { actions: { $type: "array" } }
         ]
      }
   }
)