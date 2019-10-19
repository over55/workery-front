// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
// import 'moment-timezone';

import { BootstrapErrorsProcessingAlert } from "../../bootstrap/bootstrapAlert";
// import { BootstrapCheckbox } from "../bootstrap/bootstrapCheckbox";
import { BootstrapInput } from "../../bootstrap/bootstrapInput";
import { BootstrapSingleSelect } from "../../bootstrap/bootstrapSingleSelect";
import { BootstrapTelephoneInput } from "../../bootstrap/bootstrapTelephoneInput";
import { BootstrapRadio } from "../../bootstrap/bootstrapRadio";
import { BootstrapDatePicker } from '../../bootstrap/bootstrapDatePicker';
import { BootstrapCurrencyInput } from "../../bootstrap/bootstrapCurrencyInput";
import {
    IS_OK_TO_EMAIL_CHOICES, IS_OK_TO_TEXT_CHOICES,
    PRIMARY_PHONE_CONTACT_POINT_TYPE_OF_CHOICES, SECONDARY_PHONE_CONTACT_POINT_TYPE_OF_CHOICES
} from "../../../constants/api";


class ZeroAmountDueStep1Component extends Component {
    render() {
        const {
            orderId, order,
            paidAt, onPaidAtChange,
            depositMethod, paidTo, paidFor, onRadioChange,
            amount, onAmountChange,
            errors,
            isLoading, onClick, onSelectChange,
            invoiceAmountDue
        } = this.props;
        return (
            <main id="main" role="main">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                           <Link to="/dashboard"><i className="fas fa-tachometer-alt"></i>&nbsp;Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">
                            <Link to="/financials"><i className="fas fa-credit-card"></i>&nbsp;Financials</Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">
                            <Link to={`/financial/${orderId}/deposits`}>
                                <i className="fas fa-money-check-alt"></i>&nbsp;Order #{orderId && orderId.toLocaleString(navigator.language, { minimumFractionDigits: 0 })}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <i className="fas fa-coins"></i>&nbsp;Zero Amount Due
                        </li>
                    </ol>
                </nav>

                <h1>
                    <i className="fas fa-coins"></i>&nbsp;Zero Amount Due
                </h1>

                <div className="row">
                    <div className="step-navigation">
                        <div id="step-1" className="st-grey active">
                            <strong>
                                <span className="num">1.</span><span className="">Decision</span>
                            </strong>
                        </div>
                        <div id="step-2" className="st-grey">
                            <span className="num">2.</span><span className="">Review</span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-5 mx-auto mt-2">
                        <form>
                            <h2>
                                <i className="fas fa-coins"></i>&nbsp;Zero Amount Due Details
                            </h2>

                            <p><strong>Would you like to reduce the amount due on this work order to $0.00? If so please fill out the following form, else return to the main list.</strong></p>

                            <p>All fields which have the (*) symbol are required to be filled out.</p>

                            <BootstrapErrorsProcessingAlert errors={errors} />

                            <BootstrapDatePicker
                                label="When was this deposit paid? (*)"
                                name="paidAt"
                                dateObj={paidAt}
                                onTimeChange={onPaidAtChange}
                                datePickerClassName="form-control form-control-lg border"
                                divClassName="form-group p-0 col-md-7 mb-4"
                                error={errors.paidAt}
                            />

                            <BootstrapRadio
                                inputClassName="form-check-input form-check-input-lg"
                                borderColour="border-primary"
                                error={errors.depositMethod}
                                label="How was this deposit paid? (*)"
                                name="depositMethod"
                                onChange={onRadioChange}
                                selectedValue={depositMethod}
                                options={DEPOSIT_METHOD_TO_CHOICES}
                            />

                            <BootstrapRadio
                                inputClassName="form-check-input form-check-input-lg"
                                borderColour="border-primary"
                                error={errors.paidTo}
                                label="To whom was the deposit paid? (*)"
                                name="paidTo"
                                onChange={onRadioChange}
                                selectedValue={paidTo}
                                options={PAID_TO_CHOICES}
                            />

                            <BootstrapRadio
                                inputClassName="form-check-input form-check-input-lg"
                                borderColour="border-primary"
                                error={errors.paidFor}
                                label="What is this deposit for? (*)"
                                name="paidFor"
                                onChange={onRadioChange}
                                selectedValue={paidFor}
                                options={PAID_FOR_CHOICES}
                            />

                            <BootstrapCurrencyInput
                                inputClassName="form-control"
                                borderColour="border-primary"
                                error={errors.amount}
                                label="Amount (*)"
                                onChange={onAmountChange}
                                value={amount}
                                name="amount"
                                helpText="This is the amount that will be given to pay of the remaining amount."
                            />

                            <BootstrapCurrencyInput
                                inputClassName="form-control"
                                borderColour="border-success"
                                error={errors.invoiceAmountDue}
                                label="Amount Due"
                                onChange={onAmountChange}
                                value={invoiceAmountDue}
                                name="invoiceAmountDue"
                                helpText="This is the amount remaining that needs to be paid. If possible, please make sure this value is zero."
                                disabled={true}
                            />

                            <div className="form-group">
                                <button className="btn btn-primary btn-lg mt-4 float-right pl-4 pr-4" disabled={isLoading} onClick={onClick}>
                                    Next&nbsp;<i className="fas fa-chevron-right"></i>
                                </button>
                                <Link to={`/financial/${orderId}`} className="btn btn-danger btn-lg mt-4 float-left pl-4 pr-4">
                                    <i className="fas fa-times-circle"></i>&nbsp;Cancel
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>

            </main>
        );
    }
}

export default ZeroAmountDueStep1Component;


const DEPOSIT_METHOD_TO_CHOICES = [
    {
        id: 'depositMethod-1-choice',
        name: "depositMethod",
        value: 1,
        label: "Cash"
    },{
        id: 'depositMethod-2-choice',
        name: "depositMethod",
        value: 2,
        label: "Cheque"
    },{
        id: 'depositMethod-3-choice',
        name: "depositMethod",
        value: 3,
        label: "Credit"
    },{
        id: 'depositMethod-4-choice',
        name: "depositMethod",
        value: 4,
        label: "Debit"
    }
];


const PAID_TO_CHOICES = [
    {
        id: 'paidTo-1-choice',
        name: "paidTo",
        value: 1,
        label: "Associate"
    },{
        id: 'paidTo-2-choice',
        name: "paidTo",
        value: 2,
        label: "Organization"
    }
];


const PAID_FOR_CHOICES = [
    {
        id: 'paidFor-1-choice',
        name: "paidFor",
        value: 1,
        label: "Labour"
    },{
        id: 'paidFor-2-choice',
        name: "paidFor",
        value: 2,
        label: "Materials"
    },{
        id: 'paidFor-3-choice',
        name: "paidFor",
        value: 3,
        label: "Waste Removal"
    }
];
