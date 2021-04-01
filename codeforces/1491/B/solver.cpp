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
		int n, u, v;
		vector<int> a;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.u >> t.v;
	
	t.a.resize(t.n);
	
	for (int k=0; k < t.n; ++k) {
		s >> t.a[k];
	}
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	s << t.n;
	
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
		int prevPos {t.a[0]};
		bool isOk {false};
		for (int k=1; k < t.n; ++k) {
			if (t.a[k] != prevPos-1 && t.a[k] != prevPos && t.a[k] != prevPos+1) {
				isOk = true;
			}
			prevPos = t.a[k];
		}
		if (isOk) {
			cout << "0\n";
			continue;
		}
		
		bool stop {false};
		for (int k=t.n-1; k > 0; --k) {
			if (t.a[k-1] == t.a[k]-1 || t.a[k-1] == t.a[k]+1) {
				cout << min(t.u, t.v) << endl;
				stop = true;
				break;
			}
		}
		if (!stop) {
			cout << t.v + min(t.u, t.v) << endl;
		}
	}
	
	return 0;
}
