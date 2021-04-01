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
		vector<int> deck;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	
	t.deck.resize(t.n);
	for (int k=0; k < t.n; ++k) {
		s >> t.deck[k];
	}
	
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
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		//~ debug(t.n);
		int target {t.n};
		int lastIdx {t.n-1};
		int lastTargetIdx {t.n-1};
		vector<int> used;
		used.clear();
		used.resize(t.n);
		iota(used.begin(), used.end(), 1);
		vector<int> sol;
		sol.clear();
		sol.resize(0);
		for (int k=t.n-1; k >= 0; --k) {
			used[t.deck[k]-1] = 0;
			if (t.deck[k] == target) {
				//~ debug(k, lastIdx);
				for (auto it = t.deck.begin()+k; it != t.deck.begin()+lastIdx+1; ++it)
					sol.push_back(*it);
				
				for (int j=lastTargetIdx; j >= 0; --j) {
					if (used[j] != 0) {
						lastTargetIdx = j;
						target = used[j];
						break;
					}
				}
				lastIdx = k-1;
			}
		}
		for (auto& x : sol)
			cout << x << " ";
		cout << endl;
	}
	
	return 0;
}
