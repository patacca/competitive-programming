#include <bits/stdc++.h>

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
		long long n;
		vector<long long> jmps;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	
	t.jmps.resize(t.n);
	
	for (long long k=0; k < t.n; ++k) {
		s >> t.jmps[k];
	}
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	for (auto& x : t.jmps)
		s << x << " ";
	
	return s;
};

// Globals
long long T;
vector<Test> tests;


void readInput()
{
	cin >> T;
	for (long long k=0; k < T; ++k) {
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
		long long sol {0};
		vector<long long> calls(t.n);
		calls.clear();
		
		for (long long k=0; k < t.n; ++k) {
			if (t.jmps[k] == 1)
				continue;
			
			long long diff;
			// First optimization pass
			if (t.jmps[k] + k >= t.n) {
				diff = t.jmps[k] + k - t.n + 1;
				t.jmps[k] -= diff;
				if (t.jmps[k] == 0) {
					--sol;
					++t.jmps[k];
				}
				sol += diff;
			}
			
			if (t.jmps[k] == 1)
				continue;
			//~ if (k == 41)
				//~ exit(1);
			//~ for (long lonh o=0; o < 41; ++o)
				//~ cerr << t.jmps[o] << " ";
			//~ cerr << endl;
			//~ debug(k, t.jmps[k]);
			diff = t.jmps[k] - 1;
			sol += diff;
			calls[k] = diff;
			for (long long i = k; i < t.n; ++i) {
				if (calls[i] == 0)
					continue;
				//~ debug(i+t.jmps[i]-calls[i]+1, i + t.jmps[i]);
				long long b = max(i+t.jmps[i]-calls[i]+1, i+1LL);
				if (calls[i] > t.jmps[i] && i < t.n-1)
					calls[i+1] += calls[i] - t.jmps[i];
				for (long long j=b; j <= i + t.jmps[i] && j < t.n; ++j)
					++calls[j];
				t.jmps[i] = max(t.jmps[i]-calls[i], 1LL);
				calls[i] = 0;
			}
			
			/*
			for (long long o=0; o < 41; ++o)
				cerr << t.jmps[o] << " ";
			cerr << endl;
			debug(k, t.jmps[k]);
			while (t.jmps[k] > 1) {
				++sol;
				long long nextJmp {k + t.jmps[k]};
				t.jmps[k] = max(t.jmps[k] - 1, 1);
				while (nextJmp < t.n) {
					long long j {t.jmps[nextJmp]};
					t.jmps[nextJmp] = max(t.jmps[nextJmp] - 1, 1);
					nextJmp += j;
				}
			}*/
		}
		cout << sol << endl;
	}
	
	return 0;
}
