import { externalTooltip, type QuizScoreSummaryDataPoint } from './scoreTooltip';

import {
	Chart,
	BarController,
	BarElement,
	Legend,
	CategoryScale,
	LinearScale,
	Tooltip,
	type ChartOptions
} from 'chart.js';

export const initializeScoreDataPointChart = (
	id: string,
	scoreData: QuizScoreSummaryDataPoint[]
) => {
	Chart.register(BarController, BarElement, Legend, CategoryScale, LinearScale, Tooltip);

	Tooltip.positioners.cursor = function (chartElements, coordinates) {
		return coordinates;
	};

	return new Chart(document.getElementById(id), {
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

const chartOptions: ChartOptions = {
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
				},
				autoSkip: false
			}
		},
		y: {
			ticks: {
				font: {
					size: 20
				}
			},
			beginAtZero: true
		}
	}
};
