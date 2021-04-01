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
		int q;
		vector<pair<int, int>> query;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.q;
	
	t.query.resize(t.q);
	
	for (int k=0; k < t.q; ++k)
		s >> t.query[k].first >> t.query[k].second;
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
vector<Test> tests;


void readInput()
{
	Test t;
	cin >> t;
	tests.push_back(move(t));
}

void solveQuery(pair<int,int>& q)
{
	int i{0}, j{-1};
	if (q.first > q.second) {
		cout << "NO\n";
		return;
	}
	while (i < 32) {
		int b = (q.second >> i) & 1;
		
		if (b == 1) {
			while (++j <= i) {
				int b2 = (q.first >> j) & 1;
				if (b2 == 1) {
					// Found
					break;
				}
			}
			if (j > i) {
				cout << "NO\n";
				return;
			}
		}
		++i;
	}
	cout << "YES\n";
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		for (auto& q : t.query) {
			solveQuery(q);
		}
	}
	
	return 0;
}
