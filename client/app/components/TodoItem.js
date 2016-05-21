import { connect } from 'react-redux'
import React from 'react'

let TodoItem = React.createClass ({
  render() {
    return (
    <div>
      <div style={{width: '100%', height: '35px', padding: '5px'}}>
        <div className="row">
          <div className="col-lg-6">
            <div className="input-group">

              <span className="input-group-addon">
                <input type="checkbox" aria-label="..."/>
              </span>

              <input type="text" className="form-control" aria-label="..."/>

              <span className="input-group-addon" id="basic-addon2">
                <span className="glyphicon glyphicon-remove"
                      style={{cursor:"pointer"}}
                      aria-hidden="true"></span>
              </span>

            </div> {/*<!-- /input-group -->*/}
          </div>{/*<!-- /.col-lg-6 -->*/}
        </div>{/*<!-- /.row -->*/}
      </div>
    </div>
  )}
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

TodoItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoItem);

export default TodoItem
