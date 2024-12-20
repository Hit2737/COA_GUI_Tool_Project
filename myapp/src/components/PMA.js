import Graphs from './PMA/Graphs/Graphs';
import InputValue from './InputValue';
import React, { useState } from 'react';
import Output from './PMA/Output';
import CalVisualizer from './PMA/CalVisualizer';


export default function PerformanceMetricAnalyser({ mode, showAlert }) {
    const info = {
        coreCount: 'Number of Cores to parallelize the execution of instructions',
        seqIns: 'Number of Sequential Instructions (which cannot be parallelized)',
        parIns: 'Number of Instructions that can be executed on multiple cores parallelly',
        cpi: 'Number of Clock Cycles an Instruction takes to execute',
        clkRate: 'Number of Clock Cycles per nano seconds',
        overhead: 'Overhead Time  due to parallelization of instructions (in ns)',
    }
    const [coreCount, setCoreCount] = useState(1);
    const [seqIns, setSeqIns] = useState(100);
    const [parIns, setParIns] = useState(100);
    const [cpi, setCPI] = useState(1);
    const [clkRate, setClkRate] = useState(4);
    const [overhead, setOverhead] = useState(0);
    // one more missing state
    return (
        <>
            <h1 className="text-center my-3">Performance Metric Analyser</h1>
            <div className="row d-flex">
                <div className="col-md-8 mx">
                    <div className="row">
                        <InputValue mode={mode} id='coreCount' title='Core Count' content={info.coreCount} type='number' setValue={setCoreCount} value={coreCount} placeholder='Enter Core Count' min={1} max={100} />
                        <InputValue mode={mode} id='seqIns' title='Sequencial Ins.' content={info.seqIns} type='number' setValue={setSeqIns} value={seqIns} placeholder='Enter No. of Seq. Ins.' min={0} max={100000} />
                        <InputValue mode={mode} id='parIns' title='Parallelizable Ins.' content={info.parIns} type='number' setValue={setParIns} value={parIns} placeholder='Enter No. of Par. Ins.' min={0} max={100000} />
                        <InputValue mode={mode} id='cpi' title='CPI' content={info.cpi} type='float' setValue={setCPI} value={cpi} placeholder='Enter CPI' step={0.005} min={0.005} max={10} />
                        <InputValue mode={mode} id='clkRate' title='Clock Rate (GHz)' content={info.clkRate} type='float' setValue={setClkRate} value={clkRate} placeholder='Enter Clock Rate' step={0.005} min={0.005} max={100} />
                        <InputValue mode={mode} id='overhead' title='Overhead Time (ns)' content={info.overhead} type='float' setValue={setOverhead} value={overhead} placeholder='Enter Overhead Time' step={100} min={0} max={100000} />
                    </div>
                    <div className="row">
                        <div className="col">

                        </div>
                    </div>
                    <Output coreCount={coreCount} seqIns={seqIns} parIns={parIns} cpi={cpi} clkRate={clkRate} overhead={overhead} showAlert={showAlert} />
                </div>
                <div className="col-md-4 border" style={{ borderRadius: '10px' }}>
                    <CalVisualizer coreCount={coreCount} cpi={cpi} clkRate={clkRate} seqIns={seqIns} parIns={parIns} overhead={overhead} />
                </div>
            </div>

            <Graphs mode={mode} coreCount={coreCount} seqIns={seqIns} parIns={parIns} cpi={cpi} clkRate={clkRate} overhead={overhead} />
        </>
    )
}
