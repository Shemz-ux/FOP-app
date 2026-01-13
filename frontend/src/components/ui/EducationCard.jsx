import { useState } from "react";
import { GraduationCap, Edit } from "lucide-react";

export default function EducationCard({ initialData, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [educationData, setEducationData] = useState(initialData);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(educationData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEducationData(initialData);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="text-foreground">Education</h3>
        </div>
        <button
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
          className="text-primary hover:opacity-80 text-sm flex items-center gap-1"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Education Level</label>
            <select
              value={educationData.education_level}
              onChange={(e) => setEducationData({ ...educationData, education_level: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="doctorate">Doctorate</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Institution</label>
            <input
              type="text"
              value={educationData.institution_name}
              onChange={(e) => setEducationData({ ...educationData, institution_name: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block text-left">Year</label>
              <select
                value={educationData.uni_year}
                onChange={(e) => setEducationData({ ...educationData, uni_year: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
              >
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block text-left">Degree</label>
              <select
                value={educationData.degree_type}
                onChange={(e) => setEducationData({ ...educationData, degree_type: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
              >
                <option value="ba">BA</option>
                <option value="bsc">BSc</option>
                <option value="beng">BEng</option>
                <option value="ma">MA</option>
                <option value="msc">MSc</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Area of Study</label>
            <input
              type="text"
              value={educationData.area_of_study}
              onChange={(e) => setEducationData({ ...educationData, area_of_study: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Role Interest 1</label>
            <input
              type="text"
              value={educationData.role_interest_option_one}
              onChange={(e) => setEducationData({ ...educationData, role_interest_option_one: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Role Interest 2</label>
            <input
              type="text"
              value={educationData.role_interest_option_two}
              onChange={(e) => setEducationData({ ...educationData, role_interest_option_two: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-left">Society</label>
            <input
              type="text"
              value={educationData.society}
              onChange={(e) => setEducationData({ ...educationData, society: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary text-left"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Education Level</div>
            <div className="text-foreground capitalize text-left">{educationData.education_level}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Institution</div>
            <div className="text-foreground text-left">{educationData.institution_name}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1 text-left">Year</div>
              <div className="text-foreground text-left">{educationData.uni_year} Year</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1 text-left">Degree</div>
              <div className="text-foreground uppercase text-left">{educationData.degree_type}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Area of Study</div>
            <div className="text-foreground text-left">{educationData.area_of_study}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Career Interests</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                {educationData.role_interest_option_one}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                {educationData.role_interest_option_two}
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1 text-left">Society</div>
            <div className="text-foreground text-left">{educationData.society}</div>
          </div>
        </div>
      )}
    </div>
  );
}
