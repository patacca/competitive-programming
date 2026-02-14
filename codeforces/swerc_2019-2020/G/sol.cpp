#include <bits/stdc++.h>

using namespace std;

int main() {
	int S, L, N;
	
	cin >> S >> L >> N;
	
	unordered_map<string, int> map;
	unordered_map<int, string> revMap;
	int cont = 0;
	vector<string> names(S);
	
	for (int k=0; k < S; ++k)
		cin >> names[k];
	
	sort(names.begin(), names.end());
	for (int k=0; k < S; ++k) {
		revMap[cont] = names[k];
		map[names[k]] = cont++;
	}
	
	vector<int> pref(S, 0);
	vector<string> sol(N);
	vector<int> curr(N);
	vector<vector<bool>> canSwap(S+1, vector<bool>(S+1, false));
	
	for (int k=0; k <= S; ++k) {
		canSwap[S][k] = true;
		canSwap[k][S] = true;
	}
	
	for (int k=0; k < L; ++k) {
		string n1, n2;
		cin >> n1 >> n2;
		canSwap[map[n1]][map[n2]] = true;
		canSwap[map[n2]][map[n1]] = true;
	}
	
	for (int k=0; k < N; ++k) {
		string name;
		cin >> name;
		curr[k] = map[name];
	}
	
	for (int k=0; k < N; ++k) {
		int candidate;
		
		for (candidate=0; candidate < S; ++candidate) {
			while (pref[candidate] < N && canSwap[candidate][curr[pref[candidate]]] && candidate != curr[pref[candidate]])
				++pref[candidate];
			if (pref[candidate] < N && curr[pref[candidate]] == candidate) {
				curr[pref[candidate]] = S;
				break;
			}
		}
		
		sol[k] = revMap[candidate];
	}
	
	for (int k=0; k < N; ++k)
		cout << sol[k] << " ";
	cout << endl;
	
	return 0;
}
