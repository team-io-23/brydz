function CurrentScore({ score }: { score: number }) {
    return (
        <div className="current-score">
            <h2>Current Score</h2>
            <p>{score}</p>
        </div>
    );
}

export default CurrentScore;