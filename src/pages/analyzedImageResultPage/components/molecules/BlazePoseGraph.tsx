import React, { useMemo } from 'react';
import { BlazePoseLandmark } from '../../../../types/blazePose';
import { 
  BLAZE_POSE_CONNECTIONS, 
  getBlazePoseJointCategory,
  getBlazePoseCategoryColor,
  getBlazePoseJointName,
  GRAPH_CONFIG,
  CoordinateType,
  ProjectionType,
  COORDINATE_TYPE_NAMES,
  PROJECTION_TYPE_NAMES
} from '../../constants/blazePoseConstants';

type BlazePoseGraphProps = {
  landmarks?: BlazePoseLandmark[];
  worldLandmarks?: BlazePoseLandmark[];
  coordinateType: CoordinateType;
  projectionType: ProjectionType;
  title?: string;
};

export const BlazePoseGraph: React.FC<BlazePoseGraphProps> = ({
  landmarks,
  worldLandmarks,
  coordinateType,
  projectionType,
  title
}) => {
  const data = coordinateType === 'landmarks' ? landmarks : worldLandmarks;

  const graphTitle = title || `${COORDINATE_TYPE_NAMES[coordinateType]} - ${PROJECTION_TYPE_NAMES[projectionType]}`;

  const { points, connections } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], connections: [] };
    }

    // Extract x, y coordinates based on projection type
    const extractCoordinates = (landmark: BlazePoseLandmark) => {
      if (projectionType === 'xy') {
        return { x: landmark.x, y: landmark.y };
      } else { // yz - Side view: Z(depth) on X-axis, Y(vertical) on Y-axis
        return { x: landmark.z, y: landmark.y };
      }
    };

    // Calculate bounds for normalization
    const coords = data.map(extractCoordinates);
    const xValues = coords.map(c => c.x);
    const yValues = coords.map(c => c.y);
    
    const bounds = {
      minX: Math.min(...xValues),
      maxX: Math.max(...xValues),
      minY: Math.min(...yValues),
      maxY: Math.max(...yValues)
    };

    // Add padding to bounds
    const xRange = bounds.maxX - bounds.minX;
    const yRange = bounds.maxY - bounds.minY;
    const padding = 0.1; // 10% padding
    
    bounds.minX -= xRange * padding;
    bounds.maxX += xRange * padding;
    bounds.minY -= yRange * padding;
    bounds.maxY += yRange * padding;

    // Normalize coordinates to SVG viewport
    const { width, height, margin } = GRAPH_CONFIG;
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const normalizeX = (x: number) => {
      if (bounds.maxX === bounds.minX) return graphWidth / 2;
      return ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * graphWidth;
    };

    const normalizeY = (y: number) => {
      if (bounds.maxY === bounds.minY) return graphHeight / 2;
      
      const normalizedY = ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * graphHeight;
      
      // Both coordinate systems: don't flip, let the data display as-is
      // The BlazePose model outputs are already in the correct orientation
      return normalizedY;
    };

    // Create points with normalized coordinates
    const points = data.map((landmark, index) => {
      const { x, y } = extractCoordinates(landmark);
      return {
        index,
        x: normalizeX(x),
        y: normalizeY(y),
        visibility: landmark.visibility,
        category: getBlazePoseJointCategory(index),
        originalX: x,
        originalY: y
      };
    });

    // Create connections (include all connections, use line style to indicate confidence)
    const connections = BLAZE_POSE_CONNECTIONS
      .filter(([startIdx, endIdx]) => {
        const startPoint = points[startIdx];
        const endPoint = points[endIdx];
        // Draw connections if both points exist
        return startPoint && endPoint;
      })
      .map(([startIdx, endIdx]) => {
        const start = points[startIdx];
        const end = points[endIdx];
        const minVisibility = Math.min(start.visibility, end.visibility);
        
        return {
          start,
          end,
          isHighConfidence: minVisibility > 0.5, // Use solid line for high confidence
          visibility: minVisibility
        };
      });

    return { points, connections };
  }, [data, projectionType]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <p className="text-gray-500 text-sm">{graphTitle}</p>
          <p className="text-gray-400 text-xs mt-1">데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  const { width, height, margin, pointRadius, lineWidth } = GRAPH_CONFIG;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">{graphTitle}</h4>
      
      <svg width={width} height={height} className="border border-gray-100 rounded">
        {/* Background */}
        <rect width={width} height={height} fill="#fafafa" />
        
        {/* Grid lines */}
        <g stroke="#e5e7eb" strokeWidth="0.5">
          {/* Vertical grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const x = margin.left + (i * (width - margin.left - margin.right) / 4);
            return (
              <line key={`v-${i}`} x1={x} y1={margin.top} x2={x} y2={height - margin.bottom} />
            );
          })}
          
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = margin.top + (i * (height - margin.top - margin.bottom) / 4);
            return (
              <line key={`h-${i}`} x1={margin.left} y1={y} x2={width - margin.right} y2={y} />
            );
          })}
        </g>
        
        {/* Graph content */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Connections (skeletal lines) */}
          {connections.map(({ start, end, isHighConfidence, visibility }, index) => (
            <line
              key={`connection-${index}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#6b7280"
              strokeWidth={lineWidth}
              strokeDasharray={isHighConfidence ? "0" : "3,2"} // Dashed line for low confidence
              opacity={Math.max(visibility, 0.3)} // Minimum opacity for visibility
            />
          ))}
          
          {/* Landmark points */}
          {points.map((point) => (
            <g key={`point-${point.index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={pointRadius}
                fill={getBlazePoseCategoryColor(point.category)}
                opacity={point.visibility}
                stroke="white"
                strokeWidth="1"
              />
              
              {/* Point label for high visibility points */}
              {point.visibility > 0.7 && (
                <g>
                  <text
                    x={point.x}
                    y={point.y - pointRadius - 2}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#374151"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {point.index}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - pointRadius - 14}
                    fontSize="7"
                    fill="#6b7280"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    ({getBlazePoseJointName(point.index)})
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>
        
        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 5}
          fontSize="10"
          fill="#6b7280"
          textAnchor="middle"
        >
          {projectionType === 'xy' ? 'X' : 'Z (깊이)'}
        </text>
        
        <text
          x="10"
          y={height / 2}
          fontSize="10"
          fill="#6b7280"
          textAnchor="middle"
          transform={`rotate(-90, 10, ${height / 2})`}
        >
          {projectionType === 'xy' ? 'Y' : 'Y (세로)'}
        </text>
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span>얼굴</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>상체</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>하체</span>
          </div>
        </div>
        
        <div className="text-right">
          <div>포인트: {points.length}</div>
          <div>연결: {connections.length}</div>
        </div>
      </div>
    </div>
  );
};