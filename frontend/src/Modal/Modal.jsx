import React from "react";
import "./modal.css"

class Modal extends React.Component{

    render(){
    return (
        <div className={this.props.modal_active ? "modal active" : "modal"} onClick={() => this.props.setActive(false)}>
            <div className={this.props.modal_active ? "modal-content active" : "modal-content"} onClick={e => e.stopPropagation()}>
                {this.props.children}
            </div>
        </div>
    );
    };
};
export default Modal;