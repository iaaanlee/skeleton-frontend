import React, { useMemo } from 'react';
import { 
  HYBRIK_CONNECTIONS, 
  getHybrIKJointCategory,
  getHybrIKCategoryColor,
  getHybrIKJointName
} from '../../utils/hybrikDataAdapter';
import { GRAPH_CONFIG } from '../../constants/blazePoseConstants';

type HybrIKLandmark = {
  x: number;
  y: number; 
  z: number;
  visibility: number;
};

export type CoordinateType = 'landmarks' | 'world_landmarks';
export type ProjectionType = 'xy' | 'yz';

const COORDINATE_TYPE_NAMES: Record<CoordinateType, string> = {
  'landmarks': '2D 이미지 좌표',
  'world_landmarks': '3D 월드 좌표'
};

const PROJECTION_TYPE_NAMES: Record<ProjectionType, string> = {
  'xy': 'X-Y 평면 (정면)',
  'yz': 'Y-Z 평면 (측면)'
};

type HybrIKGraphProps = {
  landmarks?: HybrIKLandmark[];
  worldLandmarks?: HybrIKLandmark[];
  coordinateType: CoordinateType;
  projectionType: ProjectionType;
  title?: string;
};

export const HybrIKGraph: React.FC<HybrIKGraphProps> = ({
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
    const extractCoordinates = (landmark: HybrIKLandmark) => {
      if (projectionType === 'xy') {
        return { x: landmark.x, y: landmark.y };
      } else { // yz - Side view: Z(depth) on X-axis, Y(vertical) on Y-axis
        return { x: landmark.z, y: landmark.y };
      }
    };

    // Calculate bounds for normalization
    const coords = data.map(extractCoordinates);
    
    // Filter out invalid coordinates (NaN, null, undefined)
    const validCoords = coords.filter(c => 
      typeof c.x === 'number' && !isNaN(c.x) && isFinite(c.x) &&
      typeof c.y === 'number' && !isNaN(c.y) && isFinite(c.y)
    );
    
    // If no valid coordinates, return empty arrays
    if (validCoords.length === 0) {
      return { points: [], connections: [] };
    }
    
    const xValues = validCoords.map(c => c.x);
    const yValues = validCoords.map(c => c.y);
    
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
    
    // Ensure we have positive ranges
    const safeXRange = xRange > 0 ? xRange : 1;
    const safeYRange = yRange > 0 ? yRange : 1;
    
    bounds.minX -= safeXRange * padding;
    bounds.maxX += safeXRange * padding;
    bounds.minY -= safeYRange * padding;
    bounds.maxY += safeYRange * padding;

    // Normalize coordinates to SVG viewport
    const { width, height, margin } = GRAPH_CONFIG;
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const normalizeX = (x: number) => {
      if (!isFinite(x) || isNaN(x)) return graphWidth / 2;
      if (bounds.maxX === bounds.minX) return graphWidth / 2;
      const normalized = ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * graphWidth;
      return isFinite(normalized) ? normalized : graphWidth / 2;
    };

    const normalizeY = (y: number) => {
      if (!isFinite(y) || isNaN(y)) return graphHeight / 2;
      if (bounds.maxY === bounds.minY) return graphHeight / 2;
      
      const normalizedY = ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * graphHeight;
      
      // Both coordinate systems: don't flip, let the data display as-is
      // The HybrIK model outputs are already in the correct orientation
      return isFinite(normalizedY) ? normalizedY : graphHeight / 2;
    };

    // Create points with normalized coordinates
    const points = data.map((landmark, index) => {
      const { x, y } = extractCoordinates(landmark);
      
      // Validate coordinates before normalization
      const isValidCoord = 
        typeof x === 'number' && !isNaN(x) && isFinite(x) &&
        typeof y === 'number' && !isNaN(y) && isFinite(y);
      
      return {
        index,
        x: isValidCoord ? normalizeX(x) : 0,
        y: isValidCoord ? normalizeY(y) : 0,
        visibility: landmark.visibility || 0,
        category: getHybrIKJointCategory(index),
        originalX: x,
        originalY: y,
        isValid: isValidCoord
      };
    });

    // Create connections using HybrIK skeleton structure
    const connections = HYBRIK_CONNECTIONS
      .filter(([startIdx, endIdx]) => {
        const startPoint = points[startIdx];
        const endPoint = points[endIdx];
        // Draw connections if both points exist and have valid coordinates
        return startPoint && endPoint && startPoint.isValid && endPoint.isValid;
      })
      .map(([startIdx, endIdx]) => {
        const start = points[startIdx];
        const end = points[endIdx];
        const minVisibility = Math.min(start.visibility || 0, end.visibility || 0);
        
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
          {points.filter(point => point.isValid).map((point) => (
            <g key={`point-${point.index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={pointRadius}
                fill={getHybrIKCategoryColor(point.category)}
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
                    ({getHybrIKJointName(point.index)})
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
          Y
        </text>
      </svg>
      
      {/* HybrIK Legend */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span>얼굴 (jaw)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>상체 (팔)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>하체 (다리)</span>
          </div>
        </div>
        
        <div className="text-right">
          <div>포인트: {points.length}/24</div>
          <div>연결: {connections.length}</div>
        </div>
      </div>
    </div>
  );
};