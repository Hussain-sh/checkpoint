interface PriorityFilterProps {
	onFilterChange: (priority: string) => void;
}

const PriorityFilter: React.FC<PriorityFilterProps> = ({ onFilterChange }) => {
	const priorities = ["All", "High", "Medium", "Low"]; // All project priorities
	return (
		<select onChange={(e) => onFilterChange(e.target.value)}>
			{priorities.map((priority) => (
				<option key={priority} value={priority}>
					{priority}
				</option>
			))}
		</select>
	);
};

export default PriorityFilter;
