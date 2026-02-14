#include <bits/stdc++.h>

using namespace std;


int N, M, T;
vector<vector<int>> g(1e6+1);
unordered_set<int> S;


bool dfs(int v, vector<bool> &already, vector<bool> &isGood) {
	if (already[v])
		return isGood[v];
	
	already[v] = true;
	for (int k : g[v])
		isGood[v] = isGood[v] | (!already[k] && S.find(k) != S.end()) | dfs(k, already, isGood);
	
	return isGood[v];
}

int main() {
	cin >> N >> M >> T;
	
	for (int k=0; k < M; ++k) {
		int a, b;
		cin >> a >> b;
		if (b == T)
			S.insert(a);
		else
			g[a].push_back(b);
	}
	
	vector<bool> already(N+1, false);
	vector<bool> isGood(N+1, false);
	vector<int> sol;
	
	for (int v : S) {
		cout << v << endl;
		if (already[v]) {
			if (isGood[v])
				sol.push_back(v);
			continue;
		}
		
		dfs(v, already, isGood);
		
		if (isGood[v])
			sol.push_back(v);
	}
	
	cout << sol.size() << endl;
	for (auto x : sol)
		cout << x << " ";
	cout << endl;
	
	return 0;
}
