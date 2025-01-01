import { DataTable } from 'simple-datatables';
import type { GetScoresScore } from '../database';

export const createDataTable = (id: string, scoreData: GetScoresScore[]) =>
	new DataTable(document.querySelector(`#${id}`) as HTMLTableElement, {
		perPageSelect: [5, 10, 15, ['All', -1]],
		data: {
			headings: ['Quiz Title', 'Student', 'Score', 'Date', 'Grade', 'Teacher'],
			data: scoreData.map((i) => [
				'testTitle',
				'testStudent',
				'testScore',
				'testDate',
				i.student.teacher.grade,
				'testTeacher'
			])
		}
	});
