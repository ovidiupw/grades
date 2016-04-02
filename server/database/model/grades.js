db.createCollection("Grades", {
  validator: {
    $or: [{
      registrationNumber: {
        $type: "string"
      }
    }, {
      courseId: {
        $type: "string"
      }
    }, {
      idModul: {
        $type: "string"
      }
    }, {
      grades: [{
        value: {
          $type: "double"
        },
        date: {
          $type: "date"
        }
      }]
    }, {
      passed: {
        $type: "bool"
      }
    }]
  }
})
