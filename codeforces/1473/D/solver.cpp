#include <string>
#include <ios>
#include <iostream>
#include <vector>
#include <tuple>
#include <unordered_set>
#include <algorithm>

using namespace std;

bool constexpr DEBUG {false};

void debug() { if constexpr(DEBUG) cerr << endl;}

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}



// USER CODE

struct Test {
	public:
		int n, m;
		string p;
		vector<pair<int,int>> queries;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.m >> t.p;
	for (int k=0; k < t.m; ++k) {
		int l, r;
		s >> l >> r;
		t.queries.push_back({l, r});
	}
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	s << t.p;
	
	return s;
};

// Globals
int T;
vector<Test> tests;


void readInput()
{
	cin >> T;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		tests.push_back(move(t));
	}
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		vector<tuple<int,int,int>> forwards;
		vector<tuple<int,int,int>> backwards;
		
		forwards.clear();
		backwards.clear();
		
		int minX {0}, maxX {0}, x {0};
		
		// Forwards
		forwards.push_back({0, 0, x});
		for (auto i=t.p.begin(); i != t.p.end(); ++i) {
			if (*i == '-')
				--x;
			else
				++x;
			if (x < minX)
				minX = x;
			else if (x > maxX)
				maxX = x;
			forwards.push_back({minX, maxX, x});
		}
		
		// backwards
		minX = maxX = x;
		backwards.push_back({x, x, x});
		for (auto i=t.p.end()-1; i != t.p.begin()-1; --i) {
			if (*i == '-')
				++x;
			else
				--x;
			if (x < minX)
				minX = x;
			else if (x > maxX)
				maxX = x;
			backwards.push_back({minX, maxX, x});
		}
		
		for (auto& query : t.queries) {
			int minX1 = get<0>(forwards[query.first-1]);
			int maxX1 = get<1>(forwards[query.first-1]);
			int x1 = get<2>(forwards[query.first-1]);
			
			if (t.n-query.second == 0) {
				cout << maxX1 - minX1 + 1 << endl;
				continue;
			}
			int minX2 = get<0>(backwards[t.n-query.second]);
			int maxX2 = get<1>(backwards[t.n-query.second]);
			int x2 = get<2>(backwards[t.n-query.second]);
			
			int diff = x2-x1;
			
			maxX2 -= diff;
			minX2 -= diff;
			
			diff = 0;
			if (maxX2 >= minX1 && minX2 <= maxX1) {
				diff = min(maxX1, maxX2) - max(minX1, minX2) + 1;
			}
			cout << maxX1 - minX1 + maxX2 - minX2 + 2 - diff << endl;
		}
	}
	
	return 0;
}
