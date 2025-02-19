import React, {useState} from 'react';
import HowCanItHelp from './HowCanItHelp';
import WhoAreProbateLoansFor from './WhoAreProbateLoansFor';
import WhatIsProbate from './WhatIsProbate';

const UnderstandingProbate = () => {
    const [open, setOpen] = useState('collapseOne');

    const toggle = (collapseId) => {
        setOpen(open === collapseId ? null : collapseId);
    };

    return (
        <div className=' card border-0 bg-white'>
            <div className='card-header row bg-white border-0 mt-2'>
                <button
                    className='btn custom-btn btn-dark col-md-3 my-1  border-0 mx-auto'
                    onClick={() => toggle('collapseOne')}
                    disabled={open === 'collapseOne'}
                    aria-expanded={open === 'collapseOne'}
                    aria-controls='collapseOne'
                >
                    Probate Overview
                </button>
                <button
                    className='btn custom-btn btn-dark border-0 my-1 col-md-3 mx-auto'
                    onClick={() => toggle('collapseTwo')}
                    disabled={open === 'collapseTwo'}
                    aria-expanded={open === 'collapseTwo'}
                    aria-controls='collapseTwo'
                >
                    Why Probate Advancements?
                </button>
                <button
                    className='btn custom-btn btn-dark border-0 my-1 col-md-3 mx-auto'
                    onClick={() => toggle('collapseThree')}
                    disabled={open === 'collapseThree'}
                    aria-expanded={open === 'collapseThree'}
                    aria-controls='collapseThree'
                >
                    Probate Advancements: <br/> Who Qualifies?
                </button>
            </div>

            <div>
                <div
                    id='collapseOne'
                    className={`collapse ${open === 'collapseOne' ? 'show' : ''}`}
                >
                    <div className='card bg-white text text-primary-emphasis border-0'>
                        <WhatIsProbate/>
                    </div>
                </div>
                <div
                    id='collapseTwo'
                    className={`collapse ${open === 'collapseTwo' ? 'show' : ''}`}
                >
                    <div className='card bg-white text text-primary-emphasis border-0'>
                        <HowCanItHelp/>
                    </div>
                </div>
                <div
                    id='collapseThree'
                    className={`collapse ${open === 'collapseThree' ? 'show' : ''}`}
                >
                    <div className='card bg-white text text-primary-emphasis border-0'>
                        <WhoAreProbateLoansFor/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderstandingProbate;
