import { getPercentageAsString } from '../dataUtils';
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
	// animation: {
	// 	duration:
	// }
	transitions: {
		show: {
			animations: {
				x: {
					from: 10000,
					duration: 1
				},
				y: {
					from: 100000,
					duration: 600
				}
			}
		}
	},
	layout: {
		padding: {
			top: 30
		}
	},
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
			formatter: (value: { averageCorrectQuestions: number; totalQuestions: number }) =>
				getPercentageAsString(value.averageCorrectQuestions, value.totalQuestions, 1)
		}
	},
	parsing: {
		xAxisKey: 'quizName',
		yAxisKey: 'averageCorrectAsPercentage'
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
			beginAtZero: true,
			min: 0,
			max: 100,
			ticks: {
				stepSize: 10,
				font: {
					size: 17
				},
				callback: (valueOfTick: number) => `${valueOfTick}%`
			}
		}
	}
};
