import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { BootstrapPageLoadingAnimation } from "../../bootstrap/bootstrapPageLoadingAnimation";
import { FlashMessageComponent } from "../../flashMessageComponent";
import {
    EXECUTIVE_GROUP_ID,
    MANAGEMENT_GROUP_ID
} from '../../../constants/api';


export default class StaffLiteRetrieveComponent extends Component {
    render() {
        const { user, id, isLoading, staff, flashMessage } = this.props;
        const canViewFunctions = user.groupId === MANAGEMENT_GROUP_ID || user.groupId === EXECUTIVE_GROUP_ID;
        return (
            <div>
                <BootstrapPageLoadingAnimation isLoading={isLoading} />
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                           <Link to="/dashboard"><i className="fas fa-tachometer-alt"></i>&nbsp;Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">
                            <Link to={`/staff`}><i className="fas fa-user-tie"></i>&nbsp;Staff</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <i className="fas fa-user"></i>&nbsp;{staff && staff.fullName}
                        </li>
                    </ol>
                </nav>

                <FlashMessageComponent object={flashMessage} />

                <h1><i className="fas fa-user"></i>&nbsp;{staff && staff.fullName}</h1>

                <div className="row">
                    <div className="step-navigation">
                        <div id="step-1" className="st-grey active">
                            <strong>
                                <span className="num"><i className="fas fa-portrait"></i>&nbsp;</span><span className="">Summary</span>
                            </strong>
                        </div>
                        <div id="step-2" className="st-grey">
                            <Link to={`/staff/${id}/full`}>
                                <span className="num"><i className="fas fa-id-card"></i>&nbsp;</span><span className="">Details</span>
                            </Link>
                        </div>
                        <div id="step-3" className="st-grey">
                            <Link to={`/staff/${id}/comments`}>
                                <span className="num"><i className="fas fa-comments"></i>&nbsp;</span><span className="">Comments</span>
                            </Link>
                        </div>
                        <div id="step-4" className="st-grey">
                            <Link to={`/staff/${id}/files`}>
                                <span className="num"><i className="fas fa-cloud"></i>&nbsp;</span><span className="">Files</span>
                            </Link>
                        </div>
                        {canViewFunctions &&
                            <div id="step-5" className="st-grey">
                                <Link to={`/staff/${id}/operations`}>
                                    <span className="num"><i className="fas fa-ellipsis-h"></i>&nbsp;</span><span className="">Operations</span>
                                </Link>
                            </div>
                        }
                    </div>
                </div>

                <div className="row mt-0 pt-3 mb-4 pb-2">
                    <div className="col-md-9 mx-auto rounded bg-light border p-2">
                        <div className="row">
                            <div className="col-sm-4">
                                <Link to={`/staff/${id}/avatar`}>
                                    {staff && staff.avatarUrl !== undefined && staff.avatarUrl !== null
                                        ? <img src={staff.avatarUrl} className="img-fluid rounded" alt="Profile" id={`staff-avatar-${id}`} />
                                        : <img src="/img/placeholder.png" className="img-fluid rounded" alt="Profile" id={`avatar-placeholder`}/>
                                    }
                                    <p><i className="fas fa-edit"></i>Click here to change photo</p>
                                </Link>
                            </div>
                            <div className="col-sm-6 px-4 py-3">
                                <h3>{staff && staff.fullName}</h3>
                                {staff && staff.address &&
                                    <p className="text-muted">
                                        <a href={staff.addressUrl}><i className="fas fa-map-marker-alt"></i>&nbsp;{staff.address}</a>
                                    </p>
                                }
                                {staff && staff.email &&
                                    <p>
                                        <a href={`mailto:${staff.email}`}><i className="fas fa-envelope"></i>&nbsp;{staff.email}</a>
                                    </p>
                                }
                                {staff && staff.telephone &&
                                    <p>
                                        <a href={`tel:${staff.e164Telephone}`}>
                                            <i className="fas fa-phone-square"></i>&nbsp;{staff.telephone}
                                        </a>
                                    </p>
                                }
                                <p className="m-0"><strong>Tags:</strong></p>
                                {staff &&
                                    <p>
                                        {staff.tags && staff.tags.map(
                                            (tag) => <TagItem tag={tag} key={tag.id} />)
                                        }
                                    </p>
                                }

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}



class TagItem extends Component {
    render() {
        const { label, value } = this.props.tag;
        return (
            <span className="badge badge-info badge-lg" value={value}>{label}</span>
        );
    };
}
