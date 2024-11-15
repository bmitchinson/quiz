import { externalTooltip, type ScoreDataPoint } from './scoreTooltip';

import {
	Chart,
	BarController,
	BarElement,
	Legend,
	CategoryScale,
	LinearScale,
	Tooltip
} from 'chart.js';

export const initializeScoreDataPointChart = (id: string, scoreData: ScoreDataPoint[]) => {
	Chart.register(BarController, BarElement, Legend, CategoryScale, LinearScale, Tooltip);

	Tooltip.positioners.cursor = function (chartElements, coordinates) {
		return coordinates;
	};

	new Chart(document.getElementById(id), {
		type: 'bar',
		options: chartOptions,
		data: {
			labels: scoreData.map((r) => r.quizName),
			datasets: [
				{
					borderColor: '#26561b',
					backgroundColor: '#26561b',
					data: scoreData,
					borderRadius: 5,
					maxBarThickness: 50
				}
			]
		}
	});
};

export const chartOptions = {
	aspectRatio: 3,
	animation: true,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			enabled: false,
			position: 'cursor',
			external: externalTooltip
		}
	},
	parsing: {
		xAxisKey: 'quizName',
		yAxisKey: 'averageScore'
	},
	scales: {
		x: {
			ticks: {
				font: {
					size: 20
				}
			}
		},
		y: {
			ticks: {
				font: {
					size: 20
				}
			}
		}
	}
};
