import React from 'react'
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

export function NullNode({ mode }) {
    return (
        <>
            <Handle type="target" id='in' position={Position.Top} style={{ background: '#fff' }} />
            <div className='text-center border' style={{ padding: 5, borderRadius: 5, width: 70 }}>
                <div className={`container my-3 text-bg-${mode}`}>
                    <p>NULL</p>
                </div>
            </div>
        </>
    )
}

export function AnnotationNode({ data }) {
    return (
        <>
            <div className='border' style={{ padding: 10, display: 'flex' }}>
                <div style={{ marginRight: 4 }}>{data.level}.</div>
                <div>{data.label}</div>
            </div>
            {data.arrowStyle && (
                <div className="arrow" style={data.arrowStyle}>
                    ⤹
                </div>
            )}
        </>
    );
}

const DLLNode = ({ data = { val: '0x00', addr: '0x00', freq: 1, prev: '0x00', next: '0x00', algo: 'LRU' } }) => {
    return (
        <div className='text-center border' style={{ padding: 10, borderRadius: 5, width: 150 }}>
            <Handle type="source" id='prev-out' position={Position.Left} style={{ top: '110px', background: '#fff' }} />
            <Handle type="target" id='prev-in' position={Position.Right} style={{ top: '110px', background: '#fff' }} />
            <div className='border-bottom my-2'>Addr: {data.addr}</div>
            <div className='container my-3'>
                <p>Data: {data.val}</p>
                {(data.algo === 'LFU') && <p>Freq: {data.freq}</p>}
                <p>Prev: {data.prev}</p>
                <p>Next: {data.next}</p>
            </div>
            <Handle type="target" id='next-in' position={Position.Left} style={{ bottom: '30px', top: 'auto', background: '#fff' }} />
            <Handle type="source" id='next-out' position={Position.Right} style={{ bottom: '30px', top: 'auto', background: '#fff' }} />
        </div>
    )
}

export default DLLNode;
