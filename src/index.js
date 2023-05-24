import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import ForceGraph2D from "react-force-graph-2d";
import { data, nodeIds, clusterIds, clusters } from "./poamData";
import * as d3 from "d3";

const App = () => {
  const [initialCenter, setInitialCenter] = useState(true);
  const [collapsedClusters, setCollapsedClusters] = useState(clusterIds);
  const [hiddenClusters, setHiddenClusters] = useState([]);
  const forceRef = useRef();

  useEffect(() => {
    // forceRef.current.d3Force("collide", d3.forceCollide(13));
    forceRef.current.d3Force("charge").strength(-40);
    forceRef.current.d3Force("link").distance(50);
    forceRef.current.d3Force("charge").distanceMax(150);
  }, []);

  const toggleClusterCollapse = (clusterId) => {
    if (collapsedClusters.includes(clusterId)) {
      setCollapsedClusters(collapsedClusters.filter((id) => id !== clusterId));
    } else {
      setCollapsedClusters([...collapsedClusters, clusterId]);
    }
  };

  const handleNodeClick = (node) => {
    toggleClusterCollapse(node.id);
    if (collapsedClusters.includes(node.id)) {
      forceRef.current.zoom(3.5, 400);
      forceRef.current.centerAt(node.x, node.y, 400);
    }
  };

  const toggleCluster = (clusterId) => {
    if (hiddenClusters.includes(clusterId)) {
      setHiddenClusters(hiddenClusters.filter((id) => id !== clusterId));
    } else {
      setHiddenClusters([...hiddenClusters, clusterId]);
    }
    if (!collapsedClusters.includes(clusterId)) {
      toggleClusterCollapse(clusterId);
    }
  };

  const graphData = useMemo(() => {
    return {
      nodes: data.nodes.filter((node) => !hiddenClusters.includes(node.id)),
      links: data.links
    };
  }, [hiddenClusters]);

  return (
    <div>
      <button
        onClick={() => {
          forceRef.current.zoomToFit();
          setHiddenClusters([]);
          setCollapsedClusters(clusterIds);
        }}
      >
        RESET
      </button>
      <div style={{ display: "inline-block", flexWrap: "wrap" }}>
        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => {
              toggleCluster(cluster.id);
            }}
          >
            Toggle {cluster.name}
          </button>
        ))}
      </div>
      <div
        style={{
          border: "1px solid gray",
          marginTop: "20px"
        }}
      >
        <ForceGraph2D
          width={window.innerWidth}
          height={650}
          ref={forceRef}
          onNodeClick={handleNodeClick}
          graphData={graphData}
          cooldownTicks={50}
          nodeRelSize={1}
          onEngineStop={() => {
            if (initialCenter) {
              forceRef.current.zoomToFit();
            }
            setInitialCenter(false);
          }}
          nodeCanvasObjectMode={() => "after"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = node.isClusterNode
              ? 14 * (node.val / 1500)
              : 14 / (globalScale * 1.2);
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = node.isClusterNode ? "white" : "black"; //node.color;
            // if (node.isClusterNode) {
            if (true) {
              // console.log();
              const lineHeight = fontSize * 1.2;
              const lines = label.split(",");
              let x = node.x;
              let y = node.y - lineHeight;
              for (let i = 0; i < lines.length; ++i) {
                ctx.fillText(lines[i], x, y);
                y += lineHeight;
              }
            } else if (globalScale >= 3.5) {
              ctx.fillText(label, node.x, node.y + 2.5);
            }
          }}
          enableNodeDrag={false}
          nodeVisibility={(node) => {
            if (collapsedClusters.includes(node.clusterId)) {
              return false;
            } else return true;
          }}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={0.7}
          linkAutoColorBy={(link) => link.color}
          linkVisibility={(link) => {
            if (
              collapsedClusters.includes(link.source.id) &&
              !link.target.isClusterNode
            ) {
              return false;
            } else if (
              hiddenClusters.includes(link.source.id) ||
              hiddenClusters.includes(link.target.id)
            ) {
              return false;
            } else return true;
          }}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("container"));
