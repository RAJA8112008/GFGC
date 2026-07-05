class Solution {
	public:
	bool twoSum(vector<int>& arr, int target) {
		sort(arr.begin(), arr.end());
		int i = 0;
		int j = arr.size() - 1;
		while (i<j) {
			int sum = arr[i]+arr[j];
			if (sum == target) {
				return true;
			} else if (sum<target) {
				i++;
			} else {
				j--;
			}
		}
		return false;
	}
};