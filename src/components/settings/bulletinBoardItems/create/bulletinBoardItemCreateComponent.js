// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from "react-router-dom";


import { BootstrapPageLoadingAnimation } from "../../../bootstrap/bootstrapPageLoadingAnimation";
import { BootstrapErrorsProcessingAlert } from "../../../bootstrap/bootstrapAlert";
// import { BootstrapCheckbox } from "../bootstrap/bootstrapCheckbox";
import { BootstrapTextarea } from "../../../bootstrap/bootstrapTextarea";


class BulletinBoardItemCreateComponent extends Component {
    render() {
        const { text, errors, onTextChange, isLoading, onClick } = this.props;
        return (
            <main id="main" role="main">
                <BootstrapPageLoadingAnimation isLoading={isLoading} />
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                           <Link to="/dashboard"><i className="fas fa-tachometer-alt"></i>&nbsp;Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                           <Link to="/settings"><i className="fas fa-cogs"></i>&nbsp;Settings</Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">
                            <Link to="/settings/bulletin-board-items"><i className="fas fa-newspaper"></i>&nbsp;Office News</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <i className="fas fa-plus"></i>&nbsp;Add
                        </li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-md-5 mx-auto mt-2">
                        <form>
                            <h1>Create New Office News</h1>
                            <p>All fields which have the (*) symbol are required to be filled out.</p>

                            <BootstrapErrorsProcessingAlert errors={errors} />

                            <BootstrapTextarea
                                name="text"
                                borderColour="border-primary"
                                label="Add message / notice to the team (*)"
                                placeholder="Please write the message which will appear on the staff office news section in the dashboard."
                                rows="5"
                                value={text}
                                helpText="This will only be visible to staff members."
                                onChange={onTextChange}
                                error={errors.text}
                            />

                            <div className="form-group">
                                <button className="btn btn-success btn-lg mt-4 float-right pl-4 pr-4" disabled={isLoading} onClick={onClick}>
                                    <i className="fas fa-check-circle"></i>&nbsp;Save
                                </button>
                                <Link to="/settings/bulletin-board-items" className="btn btn-orange btn-lg mt-4 float-left pl-4 pr-4">
                                    <i className="fas fa-arrow-circle-left"></i> Back
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>

            </main>
        );
    }
}

export default BulletinBoardItemCreateComponent;
