const result = await db.prisma.score.aggregate({
	_avg: {
		correctAnswers: true
	},
	where: {
		student: {
			teacher: {
				name: 'eklund'
			}
		}
	}
});

console.log(`Average Correct Answers for Eklund:`, result._avg.correctAnswers);
