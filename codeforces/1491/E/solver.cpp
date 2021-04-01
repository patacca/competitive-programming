#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {true};

void debug() { if constexpr(DEBUG) cerr << endl;}

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}

struct custom_hash {
	static uint64_t splitmix64(uint64_t x) {
		// http://xorshift.di.unimi.it/splitmix64.c
		x += 0x9e3779b97f4a7c15;
		x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
		x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
		return x ^ (x >> 31);
	}

	static int splitmix32(int x) {
		uint64_t z = x;
		return (splitmix64(z) & 0xffffffff);
	}

	uint64_t operator()(uint64_t x) const {
		static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
		return splitmix64(x + FIXED_RANDOM);
	}

	int operator()(int x) const {
		static const int FIXED_RANDOM = (chrono::steady_clock::now().time_since_epoch().count() & 0xffffffff);
		return splitmix32(x + FIXED_RANDOM);
	}
};




// USER CODE

struct Test {
	public:
		int n;
		unordered_map<int,int,custom_hash> nodes;
		unordered_map<int,vector<int>,custom_hash> edges;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	
	pair<int, int> p;
	while (s >> p.first >> p.second) {
		t.edges[p.first-1].push_back(p.second-1);
		t.edges[p.second-1].push_back(p.first-1);
	}
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
vector<Test> tests;
vector<bool> visited;


void readInput()
{
	Test t;
	cin >> t;
	tests.push_back(move(t));
}

void calcNodes(unordered_map<int,int,custom_hash>& nodes, unordered_map<int,vector<int>,custom_hash>& edges, int index)
{
	if (nodes[index] > 0)
		return;
	
	int sum {1};
	visited[index] = true;
	for (auto& x : edges[index]) {
		if (visited[x])
			continue;
		calcNodes(nodes, edges, x);
		sum += nodes[x];
	}
	visited[index] = false;
	
	nodes[index] = sum;
}

pair<int,int> calcFib(int goal, int f1, int f2)
{
	if (f1 + f2 == goal)
		return {f1, f2};
	if (f1 + f2 > goal)
		return {-1, -1};
	else return calcFib(goal, f2, f1+f2);
}

bool check(unordered_map<int,int,custom_hash>& nodes, unordered_map<int,vector<int>,custom_hash>& edges, int n, int startIndex)
{
	if (n == 1)
		return true;
	
	bool yes {false};
	visited.resize(n);
	t.nodes.clear();
	calcNodes(t.nodes, t.edges, 0);
	
	//~ for (int k=0; k < t.n; ++k) {
		//~ debug(k, t.nodes[k]);
	//~ }
	
	auto [fibK1, fibK2] = calcFib(t.n, 1, 1);
	if (fibK1 == -1)
		return false;
	
	//~ debug(fibK1, fibK2);
	for (int k=0; k < t.n; ++k) {
		if (t.nodes[k] == fibK1) {
			for (int j=0; j < t.edges[k].size(); ++j) {
				int oldNode = t.edges[k][j];
				del(t.edges[oldNode], k);
				t.edges[k][j] = t.edges[k].back();
				t.edges[k].pop_back();
				
				t.nodes.clear();
				calcNodes(t.nodes, t.edges, k);
				if (t.nodes[k] == fibK1) {
					calcNodes(t.nodes, t.edges, 0);
					return check(nodes, edges, nodes[k], k) && check(nodes, edges, nodes[0], 0);
				}
				
				t.edges[k].push_back(t.edges[k][j]);
				t.edges[k][j] = oldNode;
				t.edges[oldNode].push_back(k);
				
			}
			return false;
		}
	}
	if (!yes)
		cout << "NO\n";
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		if (check(t.nodes, t.edges, t.n, 0))
			cout << "YES\n";
		else
			cout << "NO\n";
	}
	
	return 0;
}
