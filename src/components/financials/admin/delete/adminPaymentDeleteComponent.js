// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { BootstrapPageLoadingAnimation } from "../../../bootstrap/bootstrapPageLoadingAnimation";
import { BootstrapErrorsProcessingAlert } from "../../../bootstrap/bootstrapAlert";
import { BootstrapInput } from "../../../bootstrap/bootstrapInput";
import {
    ARCHIVE_REASON_CHOICES
} from '../../../../constants/api';


export default class AdminPaymentDeleteComponent extends Component {
    render() {
        // Common
        const { order, paymentId, errors, onTextChange, isLoading, onClick, client } = this.props;
        return (
            <main id="main" role="main">
                <BootstrapPageLoadingAnimation isLoading={isLoading} />
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                           <Link to="/dashboard"><i className="fas fa-tachometer-alt"></i>&nbsp;Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">
                            <Link to={`/financials`}><i className="fas fa-credit-card"></i>&nbsp;Financials</Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">
                            <Link to={`/financial/${order && order.id}/deposits`}><i className="fas fa-money-check-alt"></i>&nbsp;Order #{order && order.id.toLocaleString(navigator.language, { minimumFractionDigits: 0 })}</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <i className="fas fa-code-branch"></i>&nbsp;Clone
                        </li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-md-5 mx-auto mt-2">
                        <form>
                            <h1><i className="fas fa-trash"></i>&nbsp;Delete Payment</h1>
                            <p>Warning, you are about delete payment #<strong>{paymentId}</strong> from the work order #<strong>{order && order.id}</strong>. Deletion will do the following:
                                <ul>
                                    <li>The payment will be <strong>permanently deleted</strong> from the records.</li>
                                    <li>The work order amount due will be adjusted because payment #<strong>{paymentId}</strong> will no longer be included.</li>
                                    <li>A comment will be created specifying you deleted a payment.</li>
                                    <li>You are responsible for making the necessary edits afterwords to the work order.</li>
                                </ul>
                            </p>

                            <BootstrapErrorsProcessingAlert errors={errors} />

                            <div className="form-group">
                                <button className="btn btn-success btn-lg mt-4 float-right pl-4 pr-4" disabled={isLoading} onClick={onClick}>
                                    <i className="fas fa-check-circle"></i>&nbsp;Save
                                </button>
                                <Link to={`/financial/${order && order.id}/deposits`} className="btn btn-orange btn-lg mt-4 float-left pl-4 pr-4">
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
