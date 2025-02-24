import { getPercentageCorrect } from '../dataUtils';
import { externalTooltip, type QuizScoreSummaryDataPoint } from './scoreTooltip';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
	Chart.register(ChartDataLabels);

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
		},
		// Add datalabels plugin config to render the value on top of each bar
		datalabels: {
			anchor: 'end',
			align: 'end',
			color: '#000',
			font: {
				size: 14,
				weight: 'bold'
			},
			formatter: (value: { averageScore: number; totalQuestions: number }) =>
				getPercentageCorrect(value.averageScore, value.totalQuestions, 1)
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
					size: 18
				},
				autoSkip: false
			}
		},
		y: {
			ticks: {
				font: {
					size: 17
				},
				min: 0,
				max: 100,
				callback: function (value) {
					return getPercentageCorrect(value, this.max);
				}
			},
			beginAtZero: true
		}
	}
};
