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
		int n;
		vector<int> a;
		unordered_map<int, int, custom_hash> mapping;
		vector<int> cont;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	
	//~ t.a.resize(t.n);
	//~ t.cont.resize(t.n);
	t.mapping.rehash(t.n);
	
	for (int k=0; k < t.n; ++k) {
		int tmp;
		s >> tmp;
		t.a.push_back(tmp);
		auto it {t.mapping.find(tmp)};
		if (it != t.mapping.end()) {
			++t.cont[it->second];
		} else {
			t.cont.push_back(1);
			t.mapping[tmp] = t.cont.size()-1;
		}
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
		sort(t.cont.begin(), t.cont.end());
		vector<int> partialSum;
		partialSum.clear();
		int sum = 0;
		for (auto it=t.cont.begin(); it != t.cont.end(); ++it) {
			sum += *it;
			partialSum.push_back(sum);
		}
		
		int prevVal {-1};
		int best;
		int size {static_cast<int>(t.cont.size())};
		for (int k=0; k < size; ++k) {
			//~ debug("cont[k] -->", t.cont[k]);
			if (prevVal == t.cont[k])
				continue;
			if (k == 0) {
				best = partialSum[size-1] - partialSum[k] - t.cont[k]*(size-k-1);
				prevVal = t.cont[k];
				continue;
			}
			//~ debug(partialSum[k-1], partialSum[size-1],  partialSum[k], t.cont[k]*(size-k-1));
			//~ debug(partialSum[k-1] + partialSum[size-1] - partialSum[k] - t.cont[k]*(size-k-1));
			best = min(best, partialSum[k-1] + partialSum[size-1] - partialSum[k] - t.cont[k]*(size-k-1));
			prevVal = t.cont[k];
		}
		
		cout << best << endl;
	}
	
	return 0;
}
