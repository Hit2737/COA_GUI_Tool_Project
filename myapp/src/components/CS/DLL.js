import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import DLLNode, { NullNode, AnnotationNode } from './DLLNode';

const addressMap = new WeakMap();
let addressCounter = 1000;

class DoublyLinkedListNode {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
        addressMap.set(this, addressCounter++);
    }

    get address() {
        return addressMap.get(this);
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    addNode(data) {
        const newNode = new DoublyLinkedListNode(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    insertAfter(address, data, showAlert) {
        let current = this.head;
        while (current && current.address !== address) {
            current = current.next;
        }
        if (!current) {
            showAlert(`Node with Address ${address} Not Found`, 'danger');
            return;
        }
        const newNode = new DoublyLinkedListNode(data);
        newNode.next = current.next;
        newNode.prev = current;
        if (current.next) current.next.prev = newNode;
        current.next = newNode;
        if (current === this.tail) this.tail = newNode;
        this.size++;
    }

    insertBefore(address, data, showAlert) {
        let current = this.head;
        while (current && current.address !== address) {
            current = current.next;
        }
        if (!current) {
            showAlert(`Node with Address ${address} Not Found`, 'danger');
            return;
        }
        const newNode = new DoublyLinkedListNode(data);
        newNode.prev = current.prev;
        newNode.next = current;
        if (current.prev) current.prev.next = newNode;
        current.prev = newNode;
        if (current === this.head) this.head = newNode;
        this.size++;
    }

    deleteNode(address, showAlert) {
        let current = this.head;
        while (current && current.address !== address) {
            current = current.next;
        }
        if (!current) {
            showAlert(`Node with Address ${address} Not Found`, 'danger');
            return;
        }
        if (current.prev) current.prev.next = current.next;
        if (current.next) current.next.prev = current.prev;
        if (current === this.head) this.head = current.next;
        if (current === this.tail) this.tail = current.prev;
        this.size--;
    }

    toNodeArray() {
        const nodes = [];
        let current = this.head;
        while (current) {
            nodes.push(current);
            current = current.next;
        }
        return nodes;
    }
}

const nodeTypes = {
    dllnode: DLLNode,
    NULLnode: NullNode,
    annotation: AnnotationNode,
};

const dll = new DoublyLinkedList();

export default function DLL({ mode, showAlert }) {
    const initialNodes = useMemo(() => ([
        {
            id: 'NULL',
            type: 'NULLnode',
            mode: mode,
            position: { x: 50, y: 400 },
            data: { addr: 'NULL', label: 'NULL' }
        },
        {
            id: 'annotate',
            type: 'annotation',
            mode: mode,
            draggable: false,
            position: { x: 30, y: 0 },
            data: { label: 'Head', arrowStyle: { top: 5, left: 0 } }
        }
    ]), [mode]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [nodeDataToAdd, setNodeDataToAdd] = useState("");
    const [nodeAddressToDelete, setNodeAddressToDelete] = useState("");
    const [insertAddress, setInsertAddress] = useState("");
    const [insertData, setInsertData] = useState("");

    const renderLinkedList = useCallback(() => {
        const dllNodes = dll.toNodeArray();

        const newNodes = dllNodes.map((node, index) => ({
            id: node.address.toString(),
            type: 'dllnode',
            position: { x: 200 * index + 50, y: 100 },
            data: {
                label: `Node ${index + 1}`,
                addr: node.address.toString(),
                val: node.data,
                prev: node.prev ? node.prev.address.toString() : 'NULL',
                next: node.next ? node.next.address.toString() : 'NULL',
            }
        }));

        setNodes([...initialNodes, ...newNodes]);

        const defaultEdgeOptions = {
            type: 'smoothstep',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 15,
                height: 15,
                color: mode === 'light' ? 'gray' : '#fff',
            },
            style: { stroke: mode === 'light' ? 'gray' : '#fff', strokeWidth: 1.1 },
        };

        const newEdges = dllNodes.flatMap((node) => [
            node.next && {
                id: `en${node.address}-${node.next.address}`,
                source: node.address.toString(),
                sourceHandle: 'next-out',
                target: node.next.address.toString(),
                targetHandle: 'next-in',
                ...defaultEdgeOptions,
            },
            !node.next && {
                id: `next-null-${node.address}`,
                source: node.address.toString(),
                sourceHandle: 'next-out',
                target: 'NULL',
                targetHandle: 'null-in',
                ...defaultEdgeOptions,
            },
            node.prev && {
                id: `ep${node.address}-${node.prev.address}`,
                source: node.address.toString(),
                sourceHandle: 'prev-out',
                target: node.prev.address.toString(),
                targetHandle: 'prev-in',
                ...defaultEdgeOptions,
            },
            !node.prev && {
                id: `prev-null-${node.address}`,
                source: node.address.toString(),
                sourceHandle: 'prev-out',
                target: 'NULL',
                targetHandle: 'null-in',
                ...defaultEdgeOptions,
            }
        ].filter(Boolean));

        setEdges(newEdges);
    }, [setNodes, setEdges, mode, initialNodes]);

    useEffect(() => {
        renderLinkedList();
    }, [mode, renderLinkedList]);

    const handleAddNode = () => {
        if (nodeDataToAdd === '') showAlert('Node Initialized with Empty Data', 'warning');
        dll.addNode(nodeDataToAdd);
        setNodeDataToAdd("");
        renderLinkedList();
    };

    const handleDeleteNode = () => {
        if (nodeAddressToDelete === '') showAlert('Please Enter Node Address to Delete', 'danger');
        dll.deleteNode(parseInt(nodeAddressToDelete), showAlert);
        setNodeAddressToDelete("");
        renderLinkedList();
    };

    const handleInsertAfter = () => {
        dll.insertAfter(parseInt(insertAddress), insertData, showAlert);
        setInsertAddress("");
        setInsertData("");
        renderLinkedList();
    };

    const handleInsertBefore = () => {
        dll.insertBefore(parseInt(insertAddress), insertData, showAlert);
        setInsertAddress("");
        setInsertData("");
        renderLinkedList();
    };

    return (
        <div className="container">
            <div className="mt-4 d-flex">
                <div className="container d-flex align-items-center justify-content-start">
                    <input
                        name='nodeDataToAdd'
                        className={`form-control mb-2 mx-3 text-bg-${mode}`}
                        type="text"
                        value={nodeDataToAdd}
                        onChange={(e) => setNodeDataToAdd(e.target.value)}
                        placeholder='Enter Node Data To Add'
                        style={{ width: '300px' }}
                    />
                    <button className='btn btn-primary mb-2' onClick={handleAddNode}>Add Node</button>
                </div>
                <div className="container d-flex align-items-center justify-content-start">
                    <input
                        name='nodeAddressToDelete'
                        className={`form-control mb-2 mx-3 text-bg-${mode}`}
                        type="text"
                        value={nodeAddressToDelete}
                        onChange={(e) => setNodeAddressToDelete(e.target.value)}
                        placeholder="Enter Node Address to Delete"
                        style={{ width: '300px' }}
                    />
                    <button className='btn btn-danger mb-2' onClick={handleDeleteNode}>Delete Node</button>
                </div>
            </div>
            <div className="mt-4 d-flex">
                <div className="container d-flex align-items-center justify-content-start">
                    <input
                        name='insertAddress'
                        className={`form-control mb-2 mx-3 text-bg-${mode}`}
                        type="text"
                        value={insertAddress}
                        onChange={(e) => setInsertAddress(e.target.value)}
                        placeholder="Enter Insert Position Address"
                        style={{ width: '300px' }}
                    />
                    <input
                        name='insertData'
                        className={`form-control mb-2 mx-3 text-bg-${mode}`}
                        type="text"
                        value={insertData}
                        onChange={(e) => setInsertData(e.target.value)}
                        placeholder="Enter Data for Insert"
                        style={{ width: '300px' }}
                    />
                    <button className='btn btn-primary mb-2' onClick={handleInsertAfter}>Insert After</button>
                    <button className='btn btn-primary mb-2' onClick={handleInsertBefore}>Insert Before</button>
                </div>
            </div>
            <div style={{ height: '500px' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    nodeTypes={nodeTypes}
                >
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        </div>
    );
}