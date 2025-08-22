import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { JointCoordinateData } from '../../../../types/completedPoseAnalysis';

// Chart.js 필수 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type JointCoordinateChartProps = {
  jointCoordinates: JointCoordinateData[];
  jointIndex: number;
  jointName: string;
  className?: string;
  dataType?: 'world_landmarks' | 'landmarks';
};

export const JointCoordinateChart: React.FC<JointCoordinateChartProps> = ({
  jointCoordinates,
  jointIndex,
  jointName,
  className = '',
  dataType = 'world_landmarks'
}) => {
  // 해당 관절의 좌표 데이터 추출 및 정렬 (dataType에 따라 landmarks 선택)
  const jointData = jointCoordinates
    .map(frame => ({
      timestamp: frame.timestamp,
      frameIndex: frame.frameIndex,
      joint: dataType === 'landmarks' 
        ? frame.poseLandmarks.find(joint => joint.jointIndex === jointIndex)
        : frame.worldLandmarks.find(joint => joint.jointIndex === jointIndex)
    }))
    .filter(item => item.joint)
    .sort((a, b) => a.frameIndex - b.frameIndex);

  // 데이터가 없는 경우
  if (jointData.length === 0) {
    return (
      <div className={`h-64 bg-white rounded border border-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">좌표 데이터 없음</p>
        </div>
      </div>
    );
  }

  // 차트 데이터 준비
  const labels = jointData.map(item => `${item.timestamp.toFixed(1)}s`);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'X 좌표 (m)',
        data: jointData.map(item => item.joint!.x),
        borderColor: 'rgb(239, 68, 68)', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2, // 부드러운 곡선
      },
      {
        label: 'Y 좌표 (m)',
        data: jointData.map(item => item.joint!.y),
        borderColor: 'rgb(34, 197, 94)', // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
      },
      {
        label: 'Z 좌표 (m)',
        data: jointData.map(item => item.joint!.z),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
      },
    ],
  };

  // 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${jointName} 좌표 변화`,
        font: {
          size: 14,
          weight: 600 as const,
        },
        color: '#374151', // gray-700
        padding: {
          bottom: 16
        }
      },
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 8,
          font: {
            size: 12,
          },
          color: '#6B7280', // gray-500
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (tooltipItems: TooltipItem<'line'>[]) => {
            const index = tooltipItems[0].dataIndex;
            const frameIndex = jointData[index].frameIndex;
            const timestamp = jointData[index].timestamp;
            return `프레임 ${frameIndex} (${timestamp.toFixed(1)}초)`;
          },
          label: (context: TooltipItem<'line'>) => {
            const value = (context.parsed.y as number).toFixed(3);
            return `${context.dataset.label}: ${value}`;
          },
          afterBody: (tooltipItems: TooltipItem<'line'>[]) => {
            const index = tooltipItems[0].dataIndex;
            const visibility = jointData[index].joint!.visibility;
            return `신뢰도: ${(visibility * 100).toFixed(0)}%`;
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '시간 (초)',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 600 as const,
          },
        },
        grid: {
          color: '#E5E7EB', // gray-200
          borderColor: '#D1D5DB', // gray-300
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: dataType === 'landmarks' ? '좌표 (정규화)' : '좌표 (미터)',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 600 as const,
          },
        },
        grid: {
          color: '#E5E7EB',
          borderColor: '#D1D5DB',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: function(value: string | number) {
            return (value as number).toFixed(2);
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
        hoverBorderWidth: 2,
      },
    },
  };

  return (
    <div className={`h-64 sm:h-80 bg-white rounded border border-gray-200 p-2 sm:p-4 ${className}`}>
      <Line data={data} options={options} />
    </div>
  );
};