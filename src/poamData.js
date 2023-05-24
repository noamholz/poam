const data = {
  nodes: [
    // {
    //   id: "0",
    //   isClusterNode: true,
    //   name: "project, idea, user",
    //   size: 9.785932721712538
    // },
    {
      id: "0",
      name: "poam could work",
      centrality: 0.10021091790578693,
      degrees: 35
    },
    {
      id: "1",
      isClusterNode: false,
      name: "open content platforms are attractive",
      size: 0.10021091790578693
    },
    {
      id: "2",
      name: "concise sources of information are valuable",
      size: 0.10021091790578693
    },
    {
      id: "3",
      name: "100 characters messages are too limiting",
      centrality: 0.10021091790578693,
      degrees: 35
    },
    {
      id: "4",
      name: "Graph is a bad display for blibli",
      centrality: 0.10021091790578693,
      degrees: 35
    },
    {
      id: "5",
      name: "the most popular apps are based on open content platforms",
      size: 0.10021091790578693
    }
  ],
  links: [
    {
      source: "1",
      target: "0",
      color: "blue"
    },
    {
      source: "2",
      target: "0",
      color: "blue"
    },
    {
      source: "3",
      target: "0",
      color: "red"
    },
    {
      source: "4",
      target: "0",
      color: "red"
    },
    {
      source: "5",
      target: "1",
      color: "blue"
    }
  ]
};

data.nodes.forEach((node) => {
  node.val = (node.size * 100) | (node.degrees / 10);
  if (node.isClusterNode) {
    node.clusterId = null;
  } else {
    const link = data.links.find((link) => link.target === node.id);
    node.clusterId = link && link.source;
  }
});

export const clusters = data.nodes.filter((node) => node.isClusterNode);
export const clusterIds = clusters.map((cluster) => cluster.id);
export const nodeIds = data.nodes.map((node) => node.id);

export { data };
