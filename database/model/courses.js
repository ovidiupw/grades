db.createCollection( "Courses",
   {
      validator: { $and:
         [
            { courseId: { $type: "string" } },
            { courseTitle: { $type: "string" } },
            { courseYear: { $type: "string" } },
            { courseSemester: { $type: "string" } },
            { evaluation: { $type: "string" } }
         ]
      }
   }
)