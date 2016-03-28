db.createCollection( "Modules",
   {
      validator: { $and:
         [
            { moduleId: { $type: "string" } },
            { moduleFormula: { $type: "string" } },
            { moduleMin: { $type: "double" } },
            { moduleMax: { $type: "double" } }
         ]
      }
   }
)
