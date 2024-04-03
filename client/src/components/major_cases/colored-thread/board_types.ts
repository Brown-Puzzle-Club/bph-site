export interface IThread {
  color: string;
  x: number;
  y: number;
}

export interface INode {
  id: string;
  x: number;
  y: number;
}

export interface NodeAnswer {
  node: INode;
  answer: string;
}

export interface ILink {
  from: INode;
  to: INode;
  thread: IThread;
}
